# Odyssos Studios website

The studio catalog at https://odyssos.com/ presents Lone Sands and Horizon of Steel, studio information, and contact links.

## Preview and deployment

Serve `site/` from a confirmed-free loopback port for a static preview.
`npm run dev -- --port <free-port>` starts a local Worker preview.
`npm run deploy` deploys Cloudflare Worker `odyssos` with Wrangler 4.156.0 and the existing local OAuth login.
Git pushes store source changes; deployment remains an explicit separate command.

`wrangler.jsonc` serves only `site/`, preserving existing email DNS records.
The Worker redirects `www.odyssos.com` to the apex.
Porkbun remains the registrar and Cloudflare hosts DNS and HTTPS.

## Content

Edit `site/index.html`, `site/style.css`, and `site/site.js`.
Game images come from their existing game/site projects.
The Kit form `6adb48b02b` and the existing Discord invitation remain explicitly scoped to Horizon of Steel.
Do not label that form as studio-wide or Lone Sands updates without changing its subscriber preferences and email automation first.
New games should receive their own catalog entry with real artwork, accurate availability, and working links.

See [.docs/design/00_OVERVIEW.md](.docs/design/00_OVERVIEW.md) for the documentation map.

## Domain activation status

Lone Sands catalog links temporarily use https://lonesands.adamtbandel.workers.dev/ while its Porkbun registration is incomplete.
After https://lonesands.com/ resolves and passes HTTPS checks, replace those hrefs in site/index.html and redeploy.
