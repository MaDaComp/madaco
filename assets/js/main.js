/* ==========================================================================
   madaco.be — site-script (menu, ticker, contactformulier)
   ========================================================================== */

/* ====== CONFIGURATIE ======
   Vul dit in zodra je Supabase-project bestaat (zie supabase/schema.sql).
   Project-instellingen > API > "Project URL" en "anon public" key.
   Dit is bewust de publieke, alleen-toevoegen sleutel: die mag in de
   broncode staan omdat de RLS-policies in schema.sql enkel "insert" toelaten. */
const SUPABASE_URL = "https://wnbeelsruqdlowllvezy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_i8k9Hbq438zUUcUNOEWs8g_ydWl8tt2";

function supaInsert(table, row) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn("Supabase nog niet ingesteld, niets verzonden naar " + table, row);
    return Promise.resolve();
  }
  return fetch(SUPABASE_URL + "/rest/v1/" + table, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": "Bearer " + SUPABASE_ANON_KEY,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(row)
  }).catch(() => {});
}

/* ---- UTM-bron, enkel in het geheugen, geen cookie nodig ---- */
function huidigeBron() {
  try {
    const p = new URLSearchParams(location.search);
    const u = ["utm_source", "utm_medium", "utm_campaign"].map(k => p.get(k)).filter(Boolean).join("/");
    if (u) return u;
    if (document.referrer) {
      try { return new URL(document.referrer).hostname; } catch (e) { return ""; }
    }
  } catch (e) {}
  return "";
}

/* ---- mobiel menu ---- */
function initMenu() {
  const btn = document.getElementById("navtoggle");
  const panel = document.getElementById("navpanel");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  panel.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    panel.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }));
}

/* ---- "Wat ik doe": accordeon, zoals op de live site (één tegelijk open) ---- */
function initSteps() {
  const wrap = document.getElementById("stepsaccordion");
  if (!wrap) return;
  const steps = Array.from(wrap.querySelectorAll(".step"));
  steps.forEach(step => {
    const row = step.querySelector(".step__row");
    row.addEventListener("click", () => {
      const willOpen = !step.classList.contains("open");
      steps.forEach(s => { s.classList.remove("open"); s.querySelector(".step__row").setAttribute("aria-expanded", "false"); });
      if (willOpen) {
        step.classList.add("open");
        row.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ---- header: transparant boven de hero, lichte/blur achtergrond na scroll (zoals live site) ---- */
function initHeaderScroll() {
  const header = document.getElementById("sitehead");
  if (!header) return;
  function update() {
    if (window.scrollY > 8) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---- contactformulier ---- */
function initContact() {
  const form = document.getElementById("contactform");
  if (!form) return;
  const err = document.getElementById("cerr");
  const msg = document.getElementById("cmsg");
  const submitBtn = document.getElementById("csubmit");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const naam = document.getElementById("c_naam").value.trim();
    const email = document.getElementById("c_email").value.trim();
    const bedrijf = document.getElementById("c_bedrijf").value.trim();
    const onderwerp = document.getElementById("c_onderwerp").value;
    const bericht = document.getElementById("c_bericht").value.trim();

    err.classList.add("hidden");
    if (!naam) return fail("Vul je naam in.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail("Vul een geldig e-mailadres in.");
    if (!bericht) return fail("Laat even weten waar je op vastloopt.");

    submitBtn.disabled = true;
    msg.textContent = "Moment…";

    supaInsert("contact", {
      naam, email, bedrijf,
      bericht: (onderwerp ? "[" + onderwerp + "] " : "") + bericht,
      bron: huidigeBron()
    }).finally(() => {
      submitBtn.disabled = false;
      msg.textContent = "Bedankt, ik antwoord zo snel mogelijk.";
      form.reset();
    });

    function fail(m) {
      err.textContent = m;
      err.classList.remove("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initSteps();
  initHeaderScroll();
  initContact();
});
