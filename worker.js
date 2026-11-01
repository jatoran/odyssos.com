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
