/* =========================
   Creative Vision — JS (vanilla)
   - Mobile nav
   - Scrollspy
   - Reveal on scroll
   - Counters
   - Accordion
   - Contact form (demo)
   - Tilt micro-interaction
   ========================= */

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // To top
  const toTop = $("#toTop");
  if (toTop) {
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Mobile nav
  const navToggle = $("#navToggle");
  const navList = $("#navList");
  if (navToggle && navList) {
    const closeNav = () => {
      navList.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when clicking a link
    $$(".nav__link", navList).forEach(a => a.addEventListener("click", closeNav));

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navList.contains(e.target) && !navToggle.contains(e.target)) closeNav();
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  // Scrollspy (active link)
  const sections = ["services","process","work","testimonials","faq","contact"]
    .map(id => document.getElementById(id))
    .filter(Boolean);
  const navLinks = $$(".nav__link").filter(a => a.getAttribute("href")?.startsWith("#"));

  const setActive = (id) => {
    navLinks.forEach(a => {
      const active = a.getAttribute("href") === `#${id}`;
      a.style.color = active ? "var(--text)" : "";
      a.style.borderColor = active ? "rgba(212,175,55,.22)" : "";
      a.style.background = active ? "rgba(212,175,55,.08)" : "";
    });
  };

  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    }, { root: null, threshold: [0.2, 0.35, 0.5, 0.7] });

    sections.forEach(s => spy.observe(s));
  }

  // Reveal on scroll
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.16 });

    revealEls.forEach(el => io.observe(el));
  }

  // Counters
  const counterEls = $$("[data-counter]");
  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-counter") || 0);
    const dur = 950;
    const start = performance.now();
    const from = 0;

    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(from + (target - from) * eased).toString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (counterEls.length) {
    const cIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => cIO.observe(el));
  }

  // Accordion
  const acc = $("[data-accordion]");
  if (acc) {
    const items = $$(".accordion__item", acc);
    items.forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.nextElementSibling;
        const expanded = btn.getAttribute("aria-expanded") === "true";

        // Close others
        items.forEach(b => {
          if (b !== btn) {
            b.setAttribute("aria-expanded", "false");
            const p = b.nextElementSibling;
            p?.classList.remove("is-open");
            const icon = b.querySelector(".accordion__icon");
            if (icon) icon.textContent = "+";
          }
        });

        // Toggle current
        btn.setAttribute("aria-expanded", String(!expanded));
        panel?.classList.toggle("is-open", !expanded);

        const icon = btn.querySelector(".accordion__icon");
        if (icon) icon.textContent = expanded ? "+" : "–";
      });
    });
  }

  // Contact form (demo: shows toast; you can wire to EmailJS/Formspark/Netlify later)
  const form = $("#contactForm");
  const toast = $("#toast");
  const showToast = (msg, type = "success") => {
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => {
      toast.className = "toast";
    }, 3800);
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const phone = String(fd.get("phone") || "").trim();
      const email = String(fd.get("email") || "").trim();
      const service = String(fd.get("service") || "").trim();
      const message = String(fd.get("message") || "").trim();

      // Basic validation
      if (name.length < 2) return showToast("اكتب الاسم بشكل صحيح.", "error");
      if (phone.length < 6) return showToast("اكتب رقم/واتساب صحيح.", "error");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showToast("اكتب بريد إلكتروني صحيح.", "error");
      if (!service) return showToast("اختر نوع الخدمة.", "error");
      if (message.length < 10) return showToast("اكتب وصف أطول للمشروع.", "error");

      // Demo success
      showToast("تم الإرسال بنجاح! هنرجعلك قريبًا.", "success");
      form.reset();

      // If you want to integrate later:
      // 1) Netlify Forms, 2) Formspree, 3) Formspark, 4) EmailJS
      // Then send fd via fetch(...) to the endpoint.
    });
  }

  // Tilt micro interaction for the chart card
  const tiltEl = $("[data-tilt]");
  if (tiltEl && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
    const max = 8;
    const onMove = (e) => {
      const r = tiltEl.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      const rx = (py - 0.5) * -2 * max;
      const ry = (px - 0.5) * 2 * max;
      tiltEl.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    };
    const onLeave = () => { tiltEl.style.transform = "rotateX(0) rotateY(0) translateZ(0)"; };

    tiltEl.addEventListener("mousemove", onMove);
    tiltEl.addEventListener("mouseleave", onLeave);
    tiltEl.addEventListener("touchstart", onLeave, { passive: true });
  }
})();
