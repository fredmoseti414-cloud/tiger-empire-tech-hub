// ===========================================================================
// Tiger Empire Tech Hub — EN / SW language toggle
// Pure client-side: swaps which [data-i18n] spans are visible via a
// data-lang attribute on <html>, persisted in localStorage. No translation
// service, no network call — every string is pre-written in the page.
// ===========================================================================

(function () {
  const STORAGE_KEY = "tigerLang";
  const toggle = document.getElementById("langToggle");
  if (!toggle) return;

  const buttons = toggle.querySelectorAll("[data-set-lang]");

  function applyLang(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    buttons.forEach((btn) => {
      const isActive = btn.dataset.setLang === lang;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive);
    });
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  let current = "en";
  try { current = localStorage.getItem(STORAGE_KEY) || "en"; } catch (e) {}
  applyLang(current);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.setLang));
  });
})();
