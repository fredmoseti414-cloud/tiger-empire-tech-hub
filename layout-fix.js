// ===========================================================================
// Tiger Empire Tech Hub — Fixed bottom bar layout helper
// Measures the real, rendered height of the mobile sticky call/WhatsApp/
// request bar (including the device's safe-area inset) and exposes it as a
// CSS custom property. styles.css uses this variable so page content and the
// floating quick-help button always clear the bar, on any screen or device,
// instead of relying on a guessed pixel value.
// ===========================================================================

(function () {
  var bar = document.querySelector(".sticky-cta-bar");
  var root = document.documentElement;

  function setBarHeight() {
    if (bar && window.getComputedStyle(bar).display !== "none") {
      root.style.setProperty("--sticky-bar-h", bar.offsetHeight + "px");
    } else {
      root.style.setProperty("--sticky-bar-h", "0px");
    }
  }

  if (!bar) return;

  setBarHeight();
  window.addEventListener("resize", setBarHeight);
  window.addEventListener("orientationchange", setBarHeight);
  window.addEventListener("load", setBarHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setBarHeight);
  }
})();
