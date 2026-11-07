# DirectMailAmerica

![DirectMailAmerica](assets/logo.png)

Print and mail one First-Class letter or full-color postcard to a US address, including your own. No bulk order or subscription is required. Review the proof and price before anything is sent. Super simple.

This plugin combines the DirectMailAmerica mailing skill with its hosted MCP connector. It supports Cursor through a remote HTTPS connection. It contains Markdown instructions, JSON configuration, and branding assets; it has no installation hook and runs no program automatically.

## Install in Cursor

Copy this repository into `~/.cursor/plugins/local/directmailamerica`, reload Cursor, and enable the plugin in **Customize → Plugins**. Use **MCP** to connect the `plugin-directmailamerica-directmailamerica` server. After marketplace approval, install from Cursor Marketplace instead.

## What you can do

- Quote and preview First-Class letters, Certified Mail with optional Electronic Return Receipt, and postcards.
- Prepare a 5.5 × 4.25 inch single-sided postcard or an 8.5 × 5.5 inch double-sided postcard. Use the live catalog for other products and print options.
- Use saved addresses, create and edit reusable cover sheets, convert existing artwork into a print PDF, and inspect proofs.
- Approve the exact content, addresses, options, and price, then mail using an existing workspace balance.
- Read job status, available documents, credit balance, and billing history. Printing or submission status does not establish delivery.

The connector exposes 23 tools. Cover-sheet saves require write access, preserve fixed address windows, and reject stale versions. Saving does not charge, mail, or change already approved artwork. It does not provide account funding, card checkout, crypto transfers, AI image generation, email-inbox automation, webhooks, or administrator controls. Email to Letter and Email to Postcard remain separate website services.

## Connect your account

1. Install the plugin and open its Connectors tab in Claude chat or Cowork. Add/connect DirectMailAmerica. In Claude Code, open `/mcp` to authenticate the bundled server.
2. Complete DirectMailAmerica's OAuth connection in your browser. You need a DirectMailAmerica workspace and a workspace API key from its [Developers page](https://directmailamerica.com/app/developers). Enter the key only in the service's secure connection form, never in a conversation or this package.
3. Ask “Check my DirectMailAmerica connection and permissions without sending anything.” Public prices and catalog information can be read before connecting; private workspace information requires authentication.

The server is `https://directmailamerica.com/api/mcp-narrow`. OAuth uses authorization code with PKCE and permissions limited to read, write, and approved sending. Installation alone does not authorize account access or mailing. An insufficient balance stops sending; manage funding separately on the website.

## Try it

- “Show the sizes and prices for sending myself one postcard. Do not send it.”
- “Preview this two-page First-Class letter and show the exact total before asking for approval.”
- “Use my uploaded artwork for a double-sided postcard and show both sides.”
- “List my recent mailing jobs and explain their status.”

Sending physical mail spends existing credits and can buy postage. Review the final proof, sender, recipients, and price before approving. The plugin keeps an uncertain order tied to the same request or saved quote so a retry does not become a new mailing.

## Data and privacy

The plugin sends selected tool inputs to DirectMailAmerica: mailing text or artwork, sender and recipient addresses, chosen options, and request identifiers. Authenticated reads access only the connected workspace's addresses, settings, balances, and jobs. The package does not request conversation history or memory, read environment credentials, or connect directly to additional services.

DirectMailAmerica stores account, mailing, document, billing, and security records to operate and support the service. Its backend uses hosting and authorized printing/mailing providers; relevant contents and addresses are shared for production and delivery. This is service processing behind the declared connector. The connector does not collect card details or transfer crypto. The website has additional features and processing described in the [Privacy Policy](https://directmailamerica.com/privacy).

Retention follows that policy: account and billing records remain for the account's life and a commercially reasonable period afterward; mailing records remain as needed for fulfillment, support, evidence, and legal obligations. No fixed deletion deadline is promised. Request access or deletion through the [contact page](https://directmailamerica.com/contact), subject to the policy's exceptions. The service is not directed to children under 13.

## Help and licensing

- [Connector setup and tool documentation](https://directmailamerica.com/docs/mcp-narrow?utm_source=cursor&utm_medium=referral&utm_campaign=mcp_directories)
- [Full tool contract](https://directmailamerica.com/agents/references/mcp-narrow.md)
- [Support](https://directmailamerica.com/contact)
- [Privacy Policy](https://directmailamerica.com/privacy)
- [Service terms](https://directmailamerica.com/terms)

Publisher: Rainmaker LLC, operator of DirectMailAmerica.com. The MIT license covers these plugin integration files; access to the hosted service remains subject to its terms. The license does not grant rights to use the publisher's trademarks to imply endorsement. Directory submission, approval, and publication are separate from the running service.

## Version 2 approval and free testing

Standard sends now require a saved `quote_letter` result. Review its exact PDF, addresses, options, expiry and total, then call `send_letter` with the `quoteId`, `confirmed:true`, exact `approvedTotalCents` and one stable `idempotencyKey`. Changed content requires fresh approval. Use `get_letter_quote` to recover the original result after an interruption.

Every tool publishes an output schema and returns an `operation` receipt with status, financial state and recovery instructions. The compact connector remains the default; advanced services have separate endpoints.

For development, use the [no-cost simulation guide](https://directmailamerica.com/docs/mcp-simulation) and [quickstart](https://directmailamerica.com/agents/quickstart.md). Simulation uses a separate endpoint and expiring key; it cannot spend real credits or send physical mail. The bundled connector stays connected to the normal mailing endpoint and never silently switches.

## Validate the integration

With Node.js 22 or newer, run `node scripts/validate.mjs` for local checks, or `node scripts/validate.mjs --live` for free public discovery and pricing checks. These checks do not authorize an account, create a quote, debit credits or send mail.
