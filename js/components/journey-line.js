/* Learning Journey (course pages): the vertical connector line fills as
   the section is scrolled through, and each milestone number lights up
   as the line reaches it. */

(function () {
  function init() {
    var journey = document.querySelector(".journey");
    if (!journey) return;

    var items = Array.prototype.slice.call(
      journey.querySelectorAll(".journey-item")
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      journey.style.setProperty("--journey-progress", "1");
      items.forEach(function (it) { it.classList.add("reached"); });
      return;
    }

    var ticking = false;

    function update() {
      ticking = false;

      var jr = journey.getBoundingClientRect();
      var refY = window.innerHeight * 0.62;   // where the line "point" is
      var lineTop = jr.top + 20;              // matches .journey::after top
      var lineH = jr.height - 40;

      var p = lineH > 0 ? (refY - lineTop) / lineH : 0;
      p = Math.max(0, Math.min(1, p));
      journey.style.setProperty("--journey-progress", p.toFixed(4));

      items.forEach(function (it) {
        var n = it.querySelector(".journey-number");
        if (!n) return;
        var nr = n.getBoundingClientRect();
        it.classList.toggle("reached", nr.top + nr.height / 2 <= refY);
      });
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
