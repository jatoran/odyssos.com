# Studio site architecture

## Runtime

Cloudflare Worker `odyssos` serves the buildless `site/` directory through ASSETS.
It accepts GET and HEAD, redirects www to the apex, and uses the asset service's 404-page handling.
It answers byte ranges for `/media/*.mp4` itself, because the asset service returns a whole file with a 200 and Safari will not play video from a server that does.
No server-side database or account system is needed.
GitHub stores the source but does not automatically deploy it.
`npm run deploy` publishes a version through the existing Wrangler OAuth session.

## External destinations

Lone Sands links to https://lonesands.com/ and its film section.
Horizon links to https://horizonofsteel.com/, its press kit, and Steam app 5438430 with studio-specific UTM parameters.
It's a Montage has no site or Steam app yet: its card links the trailer served from `site/media/`, and the Discord.
That file is 23.5 MB, under Workers' 25 MiB limit for one asset.
Odyssos links to the game at https://odyssos.io/ and its itch.io page.
Contact uses `contact@odyssos.com`.
The existing Kit embed retains form ID `6adb48b02b` and its current Horizon-specific audience.
Newsletter submissions go directly to Kit; this site does not handle or store email addresses.
The Discord link (`discord.gg/vQJ4BgkZwd`, a permanent invite) opens the studio's server, which covers every Odyssos game.
Changing the Kit form's audience requires reviewing its subscriber preferences and email automation first.

## Diagnostics and retention

The Worker logs successful requests and failures with timestamp, severity, request ID, path, method, status, and elapsed time.
Custom logs exclude query strings, IP addresses, cookies, and form contents.
Cloudflare Workers Logs provides durable storage with managed expiry, documented as three days for Workers Free and seven days for Workers Paid as of November 1, 2026.
Current limits: https://developers.cloudflare.com/workers/observability/logs/workers-logs/.

`site/site.js` retains a maximum of 200 local browser records from the last seven days in `odyssos:diagnostics`.
It records page lifecycle, activated link labels and destination hostnames, and runtime failures.
There is no diagnostic upload and no form input is logged.
The browser's deferred ResizeObserver notification from the Kit embed is recorded as a warning, while application failures retain error severity and their messages.
Unavailable localStorage does not affect navigation.

## Verification

Inspect desktop and mobile layouts, image loading, the Kit embed and its required email field, outbound destinations, keyboard focus, HTTPS, www redirect, and the missing-page response.
Do not send test subscriptions to real inboxes during visual QA.
Deploy only `site/`; never expose the repository, credentials, or `.trash`.
