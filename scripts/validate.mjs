/** Dependency-free package validation; --live makes only free public read calls. */
import assert from 'node:assert/strict';
import {readFile, readdir, lstat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const json = async file => JSON.parse(await readFile(path.join(root, file), 'utf8'));
const gemini = (await readdir(root)).includes('gemini-extension.json');
const manifest = await json(gemini ? 'gemini-extension.json' : '.cursor-plugin/plugin.json');
assert.equal(manifest.name, 'directmailamerica');
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
const servers = gemini ? manifest.mcpServers : (await json('mcp.json')).mcpServers;
assert.deepEqual(Object.keys(servers), ['directmailamerica']);
const endpoint = 'https://directmailamerica.com/api/mcp-narrow';
assert.deepEqual(servers.directmailamerica, {[gemini ? 'httpUrl' : 'url']: endpoint});
const skill = await readFile(path.join(root, 'skills/directmailamerica/SKILL.md'), 'utf8');
for (const phrase of ['explicit human approval', 'idempotencyKey', 'Never ask for a key in chat', 'mailing_queued']) assert.ok(skill.includes(phrase), phrase);
const reference = await readFile(path.join(root, 'skills/directmailamerica/references/mcp-narrow.md'), 'utf8');
const expected = [...reference.matchAll(/```json\n([\s\S]*?)\n```/g)].map(match => JSON.parse(match[1]));
assert.equal(expected.length, 23);
assert.ok(!expected.some(tool => /fund_credit|settle_x402|poll_all/.test(tool.name)));
const allowed = new Set(['README.md', 'LICENSE', 'assets/logo.png', 'skills/directmailamerica/SKILL.md', 'skills/directmailamerica/references/mcp-narrow.md', 'scripts/validate.mjs', ...(gemini ? ['gemini-extension.json','GEMINI.md'] : ['.cursor-plugin/plugin.json','mcp.json'])]);
async function walk(folder = '') {
  for (const entry of await readdir(path.join(root, folder))) {
    if (!folder && entry === '.git') continue;
    const relative = path.posix.join(folder, entry), info = await lstat(path.join(root, relative));
    assert.ok(!info.isSymbolicLink(), `Symlink: ${relative}`);
    if (info.isDirectory()) await walk(relative);
    else {
      assert.ok(allowed.has(relative), `Unexpected publication file: ${relative}`);
      if (!relative.endsWith('.png')) {
        const body = await readFile(path.join(root, relative), 'utf8');
        assert.doesNotMatch(body, /lbl_(?:live|test)_[A-Za-z0-9_-]{20,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}/i, relative);
      }
    }
  }
}
await walk();
if (process.argv.includes('--live')) {
  async function rpc(method, params = {}) {
    const response = await fetch(endpoint, {method:'POST', headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params}),signal:AbortSignal.timeout(30000)});
    assert.equal(response.status,200);
    const body = await response.json(); assert.ok(!body.error && !body.result?.isError, 'MCP returned an error'); return body.result;
  }
  const init = await rpc('initialize', {protocolVersion:'2025-11-25',capabilities:{},clientInfo:{name:`dma-${gemini?'gemini':'cursor'}-package-check`,version:'1.0.0'}});
  assert.equal(init.serverInfo.name,'mcp-narrow');
  assert.deepEqual((await rpc('tools/list')).tools,expected);
  const status = await rpc('tools/call',{name:'get_connection_status',arguments:{}});
  assert.equal(status.structuredContent.authenticated,false);
  const price = await rpc('tools/call',{name:'get_pricing',arguments:{mailClass:'postcard',pageCount:1,recipientCount:1}});
  assert.ok(price.structuredContent.totalCents > 0);
  const privateResponse = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'get_credits',arguments:{}}}),signal:AbortSignal.timeout(30000)});
  assert.equal(privateResponse.status,401);
  assert.match(privateResponse.headers.get('www-authenticate')??'',/resource_metadata=/);
}
console.log(JSON.stringify({client:gemini?'gemini':'cursor',version:manifest.version,tools:23,packageValid:true,publicReadChecks:process.argv.includes('--live'),checkedAt:new Date().toISOString()}));
