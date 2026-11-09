# Odyssos Studios website

https://odyssos.com/ is the site of Odyssos Studios, Adam Bandel's independent game studio.
It lists Lone Sands, Horizon of Steel, It's a Montage and Odyssos with links to each game's own site, along with a note on the studio and how to get in touch.

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
It's a Montage's card says "Coming to Steam" and links its own site, https://itsamontage.com/, and press kit; add its Steam page link once the store page is public.
`site/media/its-a-montage-trailer.mp4` stays for links shared before the game had its own site.

## Copy

Every word a visitor or a search engine reads (page text, titles, meta and Open Graph descriptions, alt text, link labels) follows `~/.agent-shared/VOICE.md`, above all "Public posts and outreach" and Adam's own rewrites at the end of it.

- Normal capitalization and full sentences.
- Each game's name is the subject, with a plain genre label; the slash-joined labels are Adam's ("an exploration/atmospheric/trick game").
- Describe each game literally, in words a stranger knows, never in its own terms: no Frames or Journeys for Horizon of Steel, no stations, arenas or tiers for It's a Montage.
- No stat dumps, feature counts, slogans or second-person trailer lines ("you ride ..., carve ...").
- Plain enthusiasm only where Adam said it himself, no marketing adjectives, no jokes and no profanity.
- Never ask for wishlists, reviews or follows; store links are labeled plainly ("Steam page").
- Every claim matches the game's store page and the brief in its marketing kit (`.private/marketing/kit/brief.md` in the game's repository), including its "Never say" list.

See [.docs/design/00_OVERVIEW.md](.docs/design/00_OVERVIEW.md) for the documentation map.
