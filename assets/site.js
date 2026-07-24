// Rampenwerk — Interaktion
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile-Navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Andock-Animation starten, sobald das Diagramm sichtbar ist
  var diagram = document.getElementById("diagram");
  if (diagram) {
    if (reduced || !("IntersectionObserver" in window)) {
      diagram.classList.add("play");
    } else {
      var dObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            diagram.classList.add("play");
            dObs.disconnect();
          }
        });
      }, { threshold: 0.35 });
      dObs.observe(diagram);
    }
  }

  // Scroll-Reveal
  var reveals = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var rObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          rObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { rObs.observe(el); });
  }

  // Anfrage-Formular → mailto
  var form = document.querySelector("form.anfrage");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var thema = form.thema.value;
      var msg = form.nachricht.value.trim();
      var subject = "Anfrage: " + thema + " (" + name + ")";
      var body = "Name / Firma: " + name + "\nE-Mail: " + email + "\nThema: " + thema + "\n\n" + msg;
      window.location.href =
        "mailto:info@rampenwerk.de?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  // Jahr im Footer
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
