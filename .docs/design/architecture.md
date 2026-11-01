# Studio site architecture

## Runtime

Cloudflare Worker `odyssos` serves the buildless `site/` directory through ASSETS.
It accepts GET and HEAD, redirects www to the apex, and uses the asset service's 404-page handling.
No server-side database or account system is needed.
GitHub stores the source but does not automatically deploy it.
`npm run deploy` publishes a version through the existing Wrangler OAuth session.

## External destinations

Lone Sands links temporarily to https://lonesands.adamtbandel.workers.dev/ and its film section while domain registration awaits completion.
Horizon links to https://horizonofsteel.com/, its press kit, and Steam app 5438430 with studio-specific UTM parameters.
Contact uses `contact@odyssos.com`.
The existing Kit embed retains form ID `6adb48b02b` and its current Horizon-specific audience.
Newsletter submissions go directly to Kit; this site does not handle or store email addresses.
The existing Discord link belongs to the Horizon community.
Changing either integration's audience requires reviewing its external configuration first.

## Diagnostics and retention

The Worker logs successful requests and failures with timestamp, severity, request ID, path, method, status, and elapsed time.
Custom logs exclude query strings, IP addresses, cookies, and form contents.
Cloudflare Workers Logs provides durable storage with managed expiry, documented as three days for Workers Free and seven days for Workers Paid as of November 1, 2026.
Current limits: https://developers.cloudflare.com/workers/observability/logs/workers-logs/.

`site/site.js` retains a maximum of 200 local browser records from the last seven days in `odyssos:diagnostics`.
It records page lifecycle, activated link labels and destination hostnames, and runtime failures.
There is no diagnostic upload and no form input is logged.
Unavailable localStorage does not affect navigation.

## Verification

Inspect desktop and mobile layouts, image loading, the Kit embed and its required email field, outbound destinations, keyboard focus, HTTPS, www redirect, and the missing-page response.
Do not send test subscriptions to real inboxes during visual QA.
Deploy only `site/`; never expose the repository, credentials, or `.trash`.
