# Odyssos Studios website

The studio catalog at https://odyssos.com/ presents Lone Sands, Horizon of Steel, It's a Montage and Odyssos, studio information, and contact links.

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
The Kit form `6adb48b02b` remains explicitly scoped to Horizon of Steel.
Do not label that form as studio-wide or Lone Sands updates without changing its subscriber preferences and email automation first.
The Discord invitation (`discord.gg/vQJ4BgkZwd`) is the studio's server, which covers every Odyssos game; Horizon of Steel has its own category there.
New games should receive their own catalog entry with real artwork, accurate availability, and working links.
It's a Montage has no Steam app yet, so its card says "Coming to Steam" and links its trailer (`site/media/its-a-montage-trailer.mp4`); add the wishlist link once the store page is public.

See [.docs/design/00_OVERVIEW.md](.docs/design/00_OVERVIEW.md) for the documentation map.
