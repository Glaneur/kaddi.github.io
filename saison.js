/* Kaddi : habillage de saison (logo, favicon, bandeau). Aucun suivi, aucun appel réseau.
   Aperçu : ajouter ?saison=noel | saint-valentin | paques | rentree | halloween à l'adresse d'une page. */
(function () {
  "use strict";
  var DAY = 86400000;

  function paques(y) { // calcul de la date de Pâques (méthode de Meeus, calendrier grégorien)
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
      m = Math.floor((a + 11 * h + 22 * l) / 451), mois = Math.floor((h + l - 7 * m + 114) / 31),
      jour = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mois - 1, jour);
  }

  function saisonDuJour(now) {
    var y = now.getFullYear(), t = new Date(y, now.getMonth(), now.getDate()).getTime();
    function dans(m1, j1, m2, j2) { return t >= new Date(y, m1 - 1, j1).getTime() && t <= new Date(y, m2 - 1, j2).getTime(); }
    var p = paques(y).getTime();
    if (t >= p - 14 * DAY && t <= p + DAY) return "paques";
    if (dans(12, 1, 12, 31) || dans(1, 1, 1, 6)) return "noel";
    if (dans(2, 1, 2, 14)) return "saint-valentin";
    if (dans(8, 25, 9, 20)) return "rentree";
    if (dans(10, 15, 11, 1)) return "halloween";
    return "";
  }

  var THEMES = {
    "noel": {
      color: "#b91c1c", text: "#ffffff", theme: "#7f1d1d",
      msg: "Joyeux Noël ! Pour les courses de fêtes, comparez les prix avant d'acheter.",
      deco: '<path d="M38 22 L52 4 Q60 14 62 30 Z" fill="#dc2626"/><rect x="34" y="20" width="30" height="8" rx="4" fill="#fff"/><circle cx="53" cy="4" r="5" fill="#fff"/>'
    },
    "saint-valentin": {
      color: "#be185d", text: "#ffffff", theme: "#831843",
      msg: "Saint-Valentin : un dîner pour deux sans se ruiner, comparez avant d'acheter.",
      deco: '<path d="M52 30 C40 20 40 8 48 8 C51 8 52 11 52 12 C52 11 53 8 56 8 C64 8 64 20 52 30 Z" fill="#f43f5e"/>'
    },
    "paques": {
      color: "#7c3aed", text: "#ffffff", theme: "#4c1d95",
      msg: "Joyeuses Pâques ! Chocolats, agneau, œufs : comparez les prix autour de chez vous.",
      deco: '<ellipse cx="52" cy="17" rx="9" ry="12" fill="#fde68a"/><path d="M43 17 H61" stroke="#f472b6" stroke-width="3"/><path d="M44.5 11 H59.5" stroke="#60a5fa" stroke-width="2.5"/><path d="M45 23 H59" stroke="#60a5fa" stroke-width="2.5"/>'
    },
    "rentree": {
      color: "#1d4ed8", text: "#ffffff", theme: "#1e3a8a",
      msg: "C'est la rentrée ! Goûters, cantine, courses de la semaine : comparez avant d'acheter.",
      deco: '<circle cx="52" cy="18" r="10" fill="#ef4444"/><path d="M52 8 Q52 3 57 2" stroke="#78350f" stroke-width="2.5" fill="none"/><path d="M53 5 Q60 1 62 7 Q56 9 53 5 Z" fill="#22c55e"/>'
    },
    "halloween": {
      color: "#c2410c", text: "#ffffff", theme: "#7c2d12",
      msg: "Halloween : bonbons et citrouilles, comparez les prix avant d'acheter.",
      deco: '<circle cx="52" cy="19" r="11" fill="#f97316"/><rect x="50" y="5" width="4" height="6" rx="1" fill="#166534"/><path d="M46 17 L49 14 L52 17 Z M52 17 L55 14 L58 17 Z" fill="#431407"/><path d="M46 23 Q52 28 58 23" stroke="#431407" stroke-width="2.5" fill="none"/>'
    }
  };

  function emblème(deco) { // le K de Kaddi (vert, or) + l'accessoire de saison
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" overflow="visible">' +
      '<rect x="4" y="8" width="52" height="52" rx="12" fill="#14532d"/>' +
      '<path d="M19 20 V48 M19 34 L38 20 M24 31 L39 48" stroke="#fbbf24" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>' +
      '<g transform="translate(54 18) scale(1.45) translate(-54 -18)">' + deco + '</g></svg>';
  }

  var forced = "";
  try { forced = (new URLSearchParams(location.search).get("saison") || "").toLowerCase(); } catch (e) {}
  var cle = THEMES[forced] ? forced : saisonDuJour(new Date());
  var th = THEMES[cle];
  if (!th) return;

  function init() {
    var svg = emblème(th.deco);

    // 1. Favicon
    var url = "data:image/svg+xml," + encodeURIComponent(svg);
    var link = document.querySelector('link[rel="icon"]');
    if (!link) { link = document.createElement("link"); link.rel = "icon"; document.head.appendChild(link); }
    link.type = "image/svg+xml"; link.href = url;
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute("content", th.theme);

    // 2. Logo de l'en-tête : emblème de saison devant le mot Kaddi
    var logo = document.querySelector("a.logo");
    if (logo && !logo.querySelector("svg")) {
      var span = document.createElement("span");
      span.setAttribute("aria-hidden", "true");
      span.style.cssText = "display:inline-block;width:34px;height:34px;flex:none";
      span.innerHTML = svg;
      logo.insertBefore(span, logo.firstChild);
      logo.setAttribute("aria-label", "Kaddi, accueil");
    }

    // 3. Bandeau de saison, fermable (mémorisé pour cette saison et cette année)
    var memo = "kaddi-saison-" + cle + "-" + new Date().getFullYear(), ferme = false;
    try { ferme = localStorage.getItem(memo) === "1"; } catch (e) {}
    if (ferme && !forced) return;
    var bar = document.createElement("div");
    bar.setAttribute("role", "note");
    bar.style.cssText = "background:" + th.color + ";color:" + th.text + ";font:600 15px/1.4 system-ui,sans-serif;" +
      "padding:9px 44px 9px 16px;text-align:center;position:relative";
    var txt = document.createElement("span"); txt.textContent = th.msg;
    var x = document.createElement("button");
    x.type = "button"; x.setAttribute("aria-label", "Fermer le bandeau");
    x.textContent = "×";
    x.style.cssText = "position:absolute;right:8px;top:50%;transform:translateY(-50%);background:transparent;border:0;color:inherit;font-size:24px;line-height:1;cursor:pointer;padding:4px 10px";
    x.onclick = function () { bar.remove(); try { localStorage.setItem(memo, "1"); } catch (e) {} };
    bar.appendChild(txt); bar.appendChild(x);
    document.body.insertBefore(bar, document.body.firstChild);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
