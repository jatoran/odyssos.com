/* Bounded, device-local diagnostics. No analytics requests or personal data. */
(() => {
  const key = `${document.body.dataset.site || "studio"}:diagnostics`;
  const session = globalThis.crypto?.randomUUID?.() || String(Date.now());
  function log(op, data = {}, level = "info") {
    const record = {
      timestamp: new Date().toISOString(),
      level,
      component: "site-ui",
      session,
      op,
      ...data,
    };
    try {
      const cutoff = Date.now() - 7 * 86400000;
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      const rows = Array.isArray(stored)
        ? stored.filter((row) => Date.parse(row.timestamp) > cutoff).slice(-199)
        : [];
      rows.push(record);
      localStorage.setItem(key, JSON.stringify(rows));
    } catch {
      /* Restricted storage must never prevent navigation or playback. */
    }
    if (level === "error") console.error(record);
  }
  log("page-ready", { path: location.pathname });
  addEventListener("pagehide", () => log("page-hidden"));
  addEventListener("error", (event) => {
    const observerDeferred =
      event.message ===
      "ResizeObserver loop completed with undelivered notifications.";
    log(
      observerDeferred ? "layout-observer-deferred" : "runtime-error",
      {
        source: event.filename?.split("?")[0].split("/").pop(),
        line: event.lineno,
        message: event.message?.slice(0, 180),
      },
      observerDeferred ? "warn" : "error",
    );
  });
  addEventListener("unhandledrejection", () =>
    log("unhandled-rejection", {}, "error"),
  );
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a");
    if (link)
      log("link-activated", {
        label: link.textContent.trim().slice(0, 70),
        destination: new URL(link.href).hostname,
      });
  });
  const trailer = document.querySelector("#trailer");
  if (trailer) {
    for (const op of ["play", "pause", "ended", "seeking", "loadedmetadata"]) {
      trailer.addEventListener(op, () =>
        log(`trailer-${op}`, { seconds: Math.round(trailer.currentTime) }),
      );
    }
    trailer.addEventListener("error", () =>
      log("trailer-failed", { code: trailer.error?.code }, "error"),
    );
  }
  const dialog = document.querySelector(".lightbox");
  if (!dialog || !dialog.showModal) return;
  let opener;
  document.querySelectorAll("[data-image]").forEach((button) =>
    button.addEventListener("click", () => {
      opener = button;
      const caption = button.dataset.caption || "";
      dialog.querySelector("img").src = button.dataset.image;
      dialog.querySelector("img").alt = caption;
      dialog.querySelector("figcaption").textContent = caption;
      dialog.showModal();
      document.body.style.overflow = "hidden";
      log("screenshot-opened", { caption });
    }),
  );
  dialog
    .querySelector(".lightbox-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
    opener?.focus();
    log("screenshot-closed");
  });
})();
