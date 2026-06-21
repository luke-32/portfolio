/* ================================================================
   Lukas Berg — Portfolio
   Vanilla JS only. Three small enhancements:
     1. Auto-update the footer year
     2. Scroll-reveal sections gently as they enter the viewport
     3. Smooth-scroll fallback for in-page nav links
   All progressive — the page works fine if JS is disabled.
   ================================================================ */

(function () {
  "use strict";

  /* --------------------------------------------------------------
     1. Footer year — always current, no manual edits needed
     -------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------
     2. Scroll reveal
        Adds .is-visible when a .reveal element scrolls into view.
        Uses IntersectionObserver; falls back to showing everything
        if the API is unavailable or motion is reduced.
     -------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!("IntersectionObserver" in window) || prefersReduced) {
    // No observer support (or user opts out) — just show content.
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target); // reveal once, then stop watching
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* --------------------------------------------------------------
     3. Smooth scroll for same-page anchors
        CSS handles this via scroll-behavior, but we also move
        keyboard focus to the target so tabbing continues from
        the right place (accessibility).
     -------------------------------------------------------------- */
  var navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;

      var target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start"
      });

      // Make the target focusable, then focus it for keyboard users.
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
})();
