document.addEventListener("DOMContentLoaded", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* -------- Scroll progress bar -------- */
    const bar = document.getElementById("scroll-progress");
    if (bar) {
        const updateBar = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - doc.clientHeight;
            const pct = max > 0 ? (doc.scrollTop / max) * 100 : 0;
            bar.style.width = pct + "%";
        };
        updateBar();
        window.addEventListener("scroll", updateBar, { passive: true });
        window.addEventListener("resize", updateBar);
    }

    /* -------- Sticky header: condense on scroll, hide down / show up -------- */
    const header = document.getElementById("site-header");
    if (header && getComputedStyle(header).position === "fixed") {
        let lastY = window.scrollY;
        const onScroll = () => {
            const y = window.scrollY;
            header.classList.toggle("scrolled", y > 24);

            if (!reduce) {
                if (y > lastY && y > 240) header.classList.add("nav-hidden");
                else header.classList.remove("nav-hidden");
            }
            lastY = y;
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* -------- Hero pointer parallax (fine pointers only) -------- */
    const hero = document.querySelector(".hero");
    const visual = document.querySelector(".hero-visual");
    if (hero && visual && !reduce && window.matchMedia("(pointer: fine)").matches) {
        const orbs = hero.querySelectorAll(".hero-orb");

        // wait for the entrance animation to finish before taking over transforms
        window.setTimeout(() => {
            hero.addEventListener("pointermove", (e) => {
                const r = hero.getBoundingClientRect();
                const dx = (e.clientX - r.left) / r.width - 0.5;
                const dy = (e.clientY - r.top) / r.height - 0.5;

                visual.style.transform = `translate3d(${dx * 18}px, ${dy * 14}px, 0)`;
                orbs.forEach((orb, i) => {
                    const k = i ? -1 : 1;
                    orb.style.transform = `translate3d(${dx * 26 * k}px, ${dy * 20 * k}px, 0)`;
                });
            });

            hero.addEventListener("pointerleave", () => {
                visual.style.transform = "";
                orbs.forEach(orb => { orb.style.transform = ""; });
            });
        }, 1300);
    }

    console.log("SP IT Academy frontend initialized");
});
