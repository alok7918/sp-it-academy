/* Thin reading-progress bar pinned to the top of the viewport.
   Width tracks how far the page has been scrolled. */

(function () {
  function init() {
    if (document.querySelector(".scroll-progress")) return;

    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.insertBefore(bar, document.body.firstChild);

    var ticking = false;

    function update() {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var progress = max > 0
        ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop) / max))
        : 0;
      bar.style.transform = "scaleX(" + progress + ")";
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
