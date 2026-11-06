const VIDEO = /^\/media\/.+\.mp4$/;

/** The asset body between byte offsets `start` and `end`, streamed so a small range never buffers the whole file. */
function sliceBody(body, start, end) {
  const { readable, writable } = new FixedLengthStream(end - start + 1);
  const pump = async () => {
    const reader = body.getReader();
    const writer = writable.getWriter();
    let offset = 0;
    try {
      while (offset <= end) {
        const { done, value } = await reader.read();
        if (done) break;
        const from = Math.max(start - offset, 0);
        const to = Math.min(end + 1 - offset, value.length);
        offset += value.length;
        if (from < to) await writer.write(value.subarray(from, to));
      }
      await writer.close();
    } catch (error) {
      await writer.abort(error).catch(() => {});
    } finally {
      await reader.cancel().catch(() => {});
    }
  };
  pump();
  return readable;
}

/** Bytes in each file version seen by this isolate, by ETag: the asset service does not expose a file's length. */
const videoSizes = new Map();

/** Counts the file once per version without holding it in memory, so concurrent requests stay within the limit. */
async function videoSize(url, env, etag) {
  const known = videoSizes.get(etag);
  if (known !== undefined) return known;
  const reader = (await env.ASSETS.fetch(new Request(url))).body.getReader();
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.length;
  }
  videoSizes.set(etag, bytes);
  return bytes;
}

/**
 * Workers' asset service answers a Range request with the whole file and a 200, and Safari will not play a video
 * from a server that does that, so video answers ranges here. A malformed or multi-part Range gets the whole file,
 * which HTTP allows.
 */
async function serveVideo(request, env) {
  const full = await env.ASSETS.fetch(new Request(request.url, { method: request.method }));
  const headers = new Headers(full.headers);
  headers.set("Accept-Ranges", "bytes");
  const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("range")?.trim() ?? "");
  const etag = full.headers.get("etag");
  const ifRange = request.headers.get("if-range");
  const stale = ifRange !== null && ifRange !== etag;
  if (request.method !== "GET" || !full.ok || !match || stale || (match[1] === "" && match[2] === "")) {
    return new Response(full.body, { status: full.status, headers });
  }
  const size = await videoSize(request.url, env, etag);
  const start = match[1] === "" ? Math.max(size - Number(match[2]), 0) : Number(match[1]);
  const end = match[1] === "" || match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  if (start >= size || start > end) {
    await full.body?.cancel();
    headers.delete("Content-Length");
    headers.set("Content-Range", `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set("Content-Length", String(end - start + 1));
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  return new Response(sliceBody(full.body, start, end), { status: 206, headers });
}

export default {
  async fetch(request, env) {
    const started = performance.now();
    const url = new URL(request.url);
    const requestId = request.headers.get("cf-ray") || crypto.randomUUID();
    try {
      let response;
      if (url.hostname === "www.odyssos.com") {
        url.hostname = "odyssos.com";
        url.protocol = "https:";
        response = Response.redirect(url.toString(), 301);
      } else if (!["GET", "HEAD"].includes(request.method)) {
        response = new Response("Method not allowed", {
          status: 405,
          headers: { Allow: "GET, HEAD" },
        });
      } else if (VIDEO.test(url.pathname)) {
        response = await serveVideo(request, env);
      } else response = await env.ASSETS.fetch(request);
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: response.status >= 500 ? "error" : "info",
          component: "odyssos-site",
          op: "request-completed",
          requestId,
          method: request.method,
          path: url.pathname,
          status: response.status,
          elapsedMs: Math.round(performance.now() - started),
        }),
      );
      return response;
    } catch (error) {
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "error",
          component: "odyssos-site",
          op: "request-failed",
          requestId,
          path: url.pathname,
          error: error.message,
        }),
      );
      return new Response("The site could not load. Please try again.", {
        status: 502,
      });
    }
  },
};
