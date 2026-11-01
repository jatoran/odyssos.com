# Odyssos site overview

Odyssos's public site is the studio catalog and contact point for its games.
The catalog currently includes Lone Sands and Horizon of Steel.

## Surfaces

- `site/index.html`: game catalog, studio information, Horizon newsletter, and contact.
- `site/style.css`: responsive editorial layout and embedded form styling.
- `site/site.js`: bounded device-local interaction diagnostics.
- `worker.js`: asset delivery, canonical redirect, method validation, and server logs.
- `wrangler.jsonc`: hosting and custom-domain configuration.

## Documentation map

- [architecture.md](architecture.md): runtime, integrations, diagnostics, and deployment.
- [README.md](../../README.md): preview and editing commands.

## Invariants

Game availability and external destinations must be real.
Horizon subscribers are not silently signed up for unrelated games.
Existing email DNS and addresses remain independent of website deployment.
The site works without JavaScript except the third-party Kit embed.
