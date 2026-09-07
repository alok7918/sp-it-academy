/* Scroll reveal — adds .visible when an element enters the viewport.
   Siblings that reveal together get an automatic stagger delay. */
document.addEventListener("DOMContentLoaded", () => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    if (!els.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
        els.forEach(e => e.classList.add("visible"));
        return;
    }

    // Stagger elements that share a parent so grids cascade in.
    const groups = new Map();
    els.forEach(el => {
        const parent = el.parentElement;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(el);
    });
    groups.forEach(list => {
        if (list.length < 2) return;
        list.forEach((el, i) => {
            el.style.transitionDelay = Math.min(i * 90, 540) + "ms";
        });
    });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    els.forEach(el => io.observe(el));
});
