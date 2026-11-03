const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Illos: each animated asset loops while it is on screen and pauses when it is not.
// Under reduced motion the assets hold one still frame on their own, so nothing runs here.
if (!reduce) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.style.setProperty("--illos-play", e.isIntersecting ? "running" : "paused");
  });
  for (const el of document.querySelectorAll("[data-illos]")) {
    el.style.setProperty("--illos-play", "paused");
    io.observe(el);
  }
}

// Mobile menu.
const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menu-btn");
const setMenu = (open) => {
  menu.classList.toggle("open", open);
  document.documentElement.classList.toggle("menu-open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
menuBtn.addEventListener("click", () => {
  const open = !menu.classList.contains("open");
  setMenu(open);
  if (open) menu.querySelector("a").focus();
});
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
});
matchMedia("(min-width: 961px)").addEventListener("change", () => setMenu(false));

// Product tabs: click, or arrow keys, Home and End once a tab has focus.
const tabs = [...document.querySelectorAll('#product [role="tab"]')];
const select = (tab, focus) => {
  for (const t of tabs) {
    const on = t === tab;
    t.setAttribute("aria-selected", on);
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute("aria-controls"));
    panel.hidden = !on;
  }
  if (focus) tab.focus();
};
tabs.forEach((t, i) => {
  t.addEventListener("click", () => { if (t.getAttribute("aria-selected") !== "true") select(t, false); });
  t.addEventListener("keydown", (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    let next = step ? tabs[(i + step + tabs.length) % tabs.length] : null;
    if (e.key === "Home") next = tabs[0];
    if (e.key === "End") next = tabs[tabs.length - 1];
    if (next) { e.preventDefault(); select(next, true); }
  });
});

// Copy buttons on the code blocks: the icon turns into a tick for a moment.
for (const btn of document.querySelectorAll("[data-copy]")) {
  const label = btn.getAttribute("aria-label");
  btn.addEventListener("click", async () => {
    const text = btn.dataset.text ?? document.getElementById(btn.dataset.copy).textContent;
    try { await navigator.clipboard.writeText(text); } catch { return; }
    btn.classList.add("done");
    btn.setAttribute("aria-label", "Copied");
    clearTimeout(btn.timer);
    btn.timer = setTimeout(() => { btn.classList.remove("done"); btn.setAttribute("aria-label", label); }, 1500);
  });
}
