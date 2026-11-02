// js/accordion.js
// Opens one FAQ panel at a time and closes the others.

const headers = document.querySelectorAll(".accordion-header");

headers.forEach(function (header) {
  header.addEventListener("click", function () {
    // Find the panel this button controls
    const panel = document.getElementById(header.getAttribute("aria-controls"));
    const wasOpen = header.getAttribute("aria-expanded") === "true";

    // Close every panel first
    headers.forEach(function (h) {
      h.setAttribute("aria-expanded", "false");
      document.getElementById(h.getAttribute("aria-controls")).hidden = true;
    });

    // Re-open the clicked one, unless it was already open
    if (!wasOpen) {
      header.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    }
  });
});