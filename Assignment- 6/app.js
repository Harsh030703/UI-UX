const navLinks = document.querySelectorAll(".menu a");
navLinks.forEach(a => {
  const u = new URL(a.href, location.href);
  if (u.pathname === location.pathname) {
    a.classList.add("active");
  }
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }
  });
});

const packagesData = [
  { id: "PKG1", destination: "Maldives", durationDays: 5, basePrice: 1199, season: "peak" },
  { id: "PKG2", destination: "Swiss Alps", durationDays: 7, basePrice: 1599, season: "summer" },
  { id: "PKG3", destination: "Tokyo", durationDays: 6, basePrice: 1399, season: "all" },
  { id: "PKG4", destination: "Rajasthan", durationDays: 6, basePrice: 899, season: "winter" },
  { id: "PKG5", destination: "Bali", durationDays: 5, basePrice: 999, season: "summer" }
];

function seasonalMultiplier(s) {
  switch (String(s).toLowerCase()) {
    case "peak": return 1.25;
    case "summer": return 1.1;
    case "winter": return 0.95;
    default: return 1;
  }
}

function weekendSurcharge(days) {
  return days >= 6 ? 1.05 : 1;
}

function computeFinalPrice(p) {
  const m = seasonalMultiplier(p.season);
  const w = weekendSurcharge(p.durationDays);
  return Math.round(p.basePrice * m * w);
}

function renderPackages() {
  const body = document.getElementById("packagesBody");
  if (!body) return;
  body.innerHTML = "";
  packagesData.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td data-id="${p.id}">${p.id}</td>
      <td>${p.destination}</td>
      <td>${p.durationDays}D/${p.durationDays - 1}N</td>
      <td>${p.season}</td>
      <td>$${p.basePrice}</td>
      <td>$${computeFinalPrice(p)}</td>
      <td><a href="booking.html" data-pkg="${p.id}">Select</a></td>
    `;
    body.appendChild(tr);
  });
}
renderPackages();

function pkgByNameOrId(v) {
  const byId = packagesData.find(x => x.id === v);
  if (byId) return byId;
  const map = {
    "Budget": "PKG4",
    "Standard": "PKG5",
    "Premium": "PKG2",
    "Honeymoon": "PKG1",
    "Maldives": "PKG1",
    "Swiss Alps": "PKG2",
    "Tokyo": "PKG3",
    "Rajasthan": "PKG4",
    "Bali": "PKG5"
  };
  const id = map[v];
  return packagesData.find(x => x.id === id) || packagesData[0];
}

function dateDiffNights(a, b) {
  const ms = 24 * 60 * 60 * 1000;
  return Math.floor((b - a) / ms);
}

function applyPromo(subtotal, code) {
  switch (String(code || "").trim().toUpperCase()) {
    case "EARLYBIRD": return subtotal * 0.9;
    case "FEST20": return subtotal * 0.8;
    case "STUDENT15": return subtotal * 0.85;
    default: return subtotal;
  }
}

function guestMultiplier(n) {
  return n > 2 ? 1.2 : 1;
}

function updateEstimator() {
  const form = document.querySelector('[data-role="booking-form"]');
  if (!form) return;

  const name = form.querySelector("#fullname");
  const email = form.querySelector("#email");
  const phone = form.querySelector("#phone");
  const travelers = form.querySelector("#travelers");
  const start = form.querySelector("#start");
  const end = form.querySelector("#end");
  const dest = form.querySelector("#destination");
  const pack = form.querySelector("#package");
  const promo = form.querySelector("#promo");
  const outN = document.getElementById("nightsOut");
  const outT = document.getElementById("totalOut");
  const btn = form.querySelector('button[type="submit"]');

  let valid = true;
  [name, email, phone, travelers, start, end, dest, pack].forEach(i => {
    if (!i || !i.value) valid = false;
  });

  const sd = new Date(start.value);
  const ed = new Date(end.value);
  const nights = isFinite(sd) * isFinite(ed) ? dateDiffNights(sd, ed) : NaN;
  if (!(nights > 0)) valid = false;

  const pkg = pkgByNameOrId(pack.value || dest.value);
  const dailyRate = computeFinalPrice(pkg) / pkg.durationDays;
  const guests = parseInt(travelers.value || "0", 10) || 0;
  const base = nights * dailyRate;
  const withGuests = base * guestMultiplier(guests);
  const final = Math.round(applyPromo(withGuests, promo.value || ""));

  if (outN) outN.textContent = Number.isFinite(nights) ? String(nights) : "0";
  if (outT) outT.textContent = valid ? `$${final}` : "—";
  if (btn) btn.disabled = !valid;
}

function bindEstimator() {
  const form = document.querySelector('[data-role="booking-form"]');
  if (!form) return;
  form.addEventListener("input", updateEstimator);
  form.addEventListener("change", updateEstimator);
  updateEstimator();
}
bindEstimator();

function enhanceGallery() {
  const grid = document.querySelector(".gallery");
  if (!grid) return;

  grid.querySelectorAll("figure img").forEach((img, i) => {
    const cap = img.closest("figure")?.querySelector("figcaption")?.textContent || "Image";
    img.setAttribute("alt", img.getAttribute("alt") || cap);
    img.setAttribute("title", cap);
    if (!img.dataset.large) {
      img.dataset.large = img.src.replace("w=1600", "w=2400");
    }
  });

  let modal = document.getElementById("imgModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "imgModal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal__backdrop" data-close="1"></div>
      <div class="modal__dialog">
        <button class="modal__close" data-close="1" aria-label="Close">×</button>
        <img class="modal__img" alt="">
        <div class="modal__caption"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const imgEl = modal.querySelector(".modal__img");
  const capEl = modal.querySelector(".modal__caption");

  function open(src, alt) {
    imgEl.src = src;
    imgEl.alt = alt;
    capEl.textContent = alt;
    modal.classList.add("open");
    document.documentElement.style.overflow = "hidden";
  }

  function close() {
    modal.classList.remove("open");
    document.documentElement.style.overflow = "";
  }

  modal.addEventListener("click", e => {
    if (e.target.dataset.close) close();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });

  grid.querySelectorAll("figure img").forEach(img => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () =>
      open(img.dataset.large || img.src, img.getAttribute("alt") || "")
    );
  });

  let toggle = document.getElementById("layoutToggle");
  if (!toggle) {
    toggle = document.createElement("button");
    toggle.id = "layoutToggle";
    toggle.className = "toggle";
    toggle.textContent = "Toggle Layout";
    grid.parentElement.insertBefore(toggle, grid);
  }

  let altLayout = false;
  toggle.addEventListener("click", () => {
    altLayout = !altLayout;
    grid.style.gridTemplateColumns = altLayout ? "repeat(2,1fr)" : "repeat(3,1fr)";
    toggle.classList.toggle("active", altLayout);
  });
}
enhanceGallery();
