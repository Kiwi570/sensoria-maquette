/* Effets propres à Sensoria (direction « Le cercle »). Le socle gère l'ouverture, les transitions, l'en-tête,
   le menu, le mode calme, les boucles, les mesures et la bibliothèque d'effets posée par attributs dans les pages.
   Effets du plan : couronne, oculus, infini, roue-domaines, fil-du-temps, carte-lieux, cercle-de-parole, bol.
   Règles : états de départ posés dans le CSS, fromTo avec valeurs d'arrivée explicites, aucune lecture de mise
   en page pendant le défilement (mesures au chargement et au redimensionnement), boucles via boucle() du socle. */
import { demarrer, boucle, etat, quand } from './socle/index.js?v=2';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const large = () => window.matchMedia('(min-width: 761px)').matches;
const anime = () => !!(gsap && ST && !etat.calme);

/* ---------- Dates : statuts recalculés chaque jour à l'heure de Paris ---------- */
const FUSEAU = 'Europe/Paris';
const aujourdhui = () => new Intl.DateTimeFormat('en-CA', { timeZone: FUSEAU, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const jours = (a, b) => {
  const [y1, m1, d1] = a.split('-').map(Number), [y2, m2, d2] = b.split('-').map(Number);
  return Math.round((Date.UTC(y1, m1 - 1, d1) - Date.UTC(y2, m2 - 1, d2)) / 86400000);
};
const statutDe = (debut, fin, jour) => (fin < jour ? 'termine' : debut <= jour ? 'encours' : 'avenir');
const libelle = (s, debut, jour) => {
  if (s === 'termine') return 'Terminé';
  if (s === 'encours') return 'en cours';
  const n = jours(debut, jour);
  return n === 1 ? 'demain' : `dans ${n} jours`;
};

function majDates() {
  const jour = aujourdhui();
  $$('[data-debut]').forEach((el) => {
    const s = statutDe(el.dataset.debut, el.dataset.fin || el.dataset.debut, jour);
    el.dataset.statut = s;
    const t = $(':scope > header [data-statut-texte], :scope > [data-statut-texte]', el);
    if (t) t.textContent = t.dataset.statutMode === 'session' ? { termine: 'Terminée', encours: 'En cours', avenir: 'À venir' }[s] : libelle(s, el.dataset.debut, jour);
  });
  /* Liste courte de l'accueil : les dates passées disparaissent, les suivantes prennent leur place. */
  $$('[data-agenda-liste]').forEach((liste) => {
    const max = +liste.dataset.agendaMax || 5;
    let n = 0;
    [...liste.children].forEach((li) => {
      const montrer = li.dataset.statut !== 'termine' && n < max;
      if (montrer) n++;
      li.hidden = !montrer;
    });
  });
  /* Information clé : prochaine session de formation. */
  const info = $('[data-prochaine-texte]');
  const donnees = $('#donnees-agenda');
  const toute = $('[data-prochaine-toute]');
  if ((info || toute) && donnees) {
    try {
      const liste = JSON.parse(donnees.textContent);
      const d = liste.find((x) => x.type === 'formation' && (x.fin || x.debut) >= jour);
      if (d && info) info.textContent = `${d.titre}, ${d.lieu}, ${periode(d)}`;
      const d2 = liste.find((x) => (x.fin || x.debut) >= jour);
      if (d2 && toute) toute.textContent = `${d2.titre}, ${d2.lieu}, ${periode(d2)}`;
    } catch {}
  }
}
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
function periode(d) {
  const [a, m, j] = d.debut.split('-').map(Number);
  const pj = (x) => (x === 1 ? '1er' : String(x));
  if (!d.fin) return `${pj(j)} ${MOIS[m - 1]} ${a}`;
  const [a2, m2, j2] = d.fin.split('-').map(Number);
  return `${pj(j)}${m !== m2 ? ' ' + MOIS[m - 1] : ''}${a !== a2 ? ' ' + a : ''} – ${pj(j2)} ${MOIS[m2 - 1]} ${a2}`;
}

/* ---------- couronne : la charpente tourne et s'ouvre au défilement ---------- */
function couronnes() {
  $$('[data-effet="couronne"]').forEach((svg) => {
    const g = $('.couronne-tourne', svg);
    if (!g) return;
    const ouvre = svg.hasAttribute('data-couronne-ouvre');
    const hero = svg.classList.contains('hero-couronne');
    gsap.fromTo(g, { rotation: hero ? 0 : -24, scale: ouvre ? 0.82 : 1, svgOrigin: '100 100' }, {
      rotation: hero ? 38 : 24, scale: ouvre ? 1.12 : 1, svgOrigin: '100 100', ease: 'none',
      scrollTrigger: { trigger: hero ? '.hero' : svg.closest('section, footer, .pied-haut') || svg, start: hero ? 'top top' : 'top bottom', end: 'bottom top', scrub: 0.8 },
    });
  });
}

/* Couronne de l'accueil calée sur le centre du toit de la vraie photo (repère de l'image, cover + object-position). */
const TOIT = { x: 0.475, y: 0.05, d: 0.74 }; /* centre du toit et diamètre, en fractions de l'image */
function calerCouronneHero() {
  const hero = $('.hero');
  const img = $('.hero-media img');
  if (!hero || !img) return;
  const caler = () => {
    const W = hero.clientWidth, H = hero.clientHeight;
    const iw = img.naturalWidth || 1280, ih = img.naturalHeight || 853;
    const s = Math.max(W / iw, H / ih);
    const rw = iw * s, rh = ih * s;
    const pos = getComputedStyle(img).objectPosition.split(' ').map((v) => parseFloat(v) / 100);
    const ox = (W - rw) * (isNaN(pos[0]) ? 0.5 : pos[0]), oy = (H - rh) * (isNaN(pos[1]) ? 0.5 : pos[1]);
    hero.style.setProperty('--oculus-x', `${ox + rw * TOIT.x}px`);
    hero.style.setProperty('--oculus-y', `${oy + rh * TOIT.y}px`);
    hero.style.setProperty('--oculus-taille', `${Math.min(rw * TOIT.d, 1400)}px`);
  };
  if (img.complete) caler(); else img.addEventListener('load', caler, { once: true });
  new ResizeObserver(caler).observe(hero);
}

/* ---------- oculus : ouverture circulaire ---------- */
function oculus() {
  /* Portraits et têtes de page : le cercle s'ouvre en entrant dans l'écran. */
  $$('[data-oculus]').forEach((fig) => {
    fig.dataset.effet = fig.dataset.effet || 'oculus';
    const debut = fig.getBoundingClientRect().top + window.scrollY < window.innerHeight * 0.9;
    const tw = gsap.fromTo(fig, { clipPath: 'circle(22% at 50% 50%)' }, { clipPath: 'circle(50% at 50% 50%)', ease: 'none', paused: debut });
    const img = $('img', fig);
    const tz = img ? gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', paused: debut }) : null;
    if (debut) {
      quand('pret', ({ mode }) => {
        const jouer = mode === 'jouee' || mode === 'voile';
        [tw, tz].forEach((t) => t && (jouer ? gsap.to(t, { progress: 1, duration: 1.4, ease: 'power3.out' }) : t.progress(1)));
      });
      return;
    }
    ST.create({ trigger: fig, start: 'top 92%', end: 'center 55%', scrub: 0.6, animation: gsap.timeline().add(tw, 0).add(tz || gsap.timeline(), 0) });
  });
  /* Accueil : en quittant l'ouverture, la photo se referme vers le centre du toit. */
  const hero = $('[data-oculus-hero]');
  if (hero) {
    gsap.fromTo(hero, { clipPath: 'circle(150% at 50% 20%)' }, {
      clipPath: 'circle(46% at 50% 20%)', ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
    });
    const img = $('img', hero);
    if (img) gsap.fromTo(img, { scale: 1 }, { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 } });
  }
}

/* ---------- infini : le trait se trace, un point de lumière le parcourt ---------- */
function infinis() {
  $$('svg.infini').forEach((svg) => {
    const trait = $('.infini-trait', svg), point = $('.infini-point', svg);
    if (!trait || !point) return;
    const L = trait.getTotalLength();
    trait.style.strokeDasharray = `${L} ${L}`;
    gsap.fromTo(trait, { strokeDashoffset: L }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: svg, start: 'top 95%', end: 'top 55%', scrub: 0.6 } });
    /* Points précalculés : aucune mesure dans la boucle. */
    const pts = Array.from({ length: 64 }, (_, i) => trait.getPointAtLength((i / 64) * L));
    boucle(svg, (dt, t) => {
      const p = pts[Math.floor(((t * 0.18) % 1) * pts.length)];
      point.setAttribute('cx', p.x.toFixed(2));
      point.setAttribute('cy', p.y.toFixed(2));
    });
  });
}

/* ---------- roue-domaines : la roue amène chaque domaine devant ---------- */
function roue() {
  const section = $('[data-roue]');
  if (!section) return;
  const roueEl = $('.roue', section);
  const etiquettes = $$('.roue-etiquette', section);
  const cartes = $$('.domaine', section);
  const n = etiquettes.length, pas = 360 / n;
  let actif = -1;
  const activer = (i) => {
    if (i === actif) return;
    actif = i;
    etiquettes.forEach((e, k) => e.classList.toggle('est-actif', k === i));
    cartes.forEach((c, k) => c.classList.toggle('est-actif', k === i));
  };
  activer(0);
  const rayon = () => roueEl.style.setProperty('--rayon-roue', `${Math.round(roueEl.clientWidth * (large() ? 0.38 : 0.33))}px`);
  rayon();
  new ResizeObserver(rayon).observe(roueEl);
  const rot = { r: 0 };
  const appliquer = () => roueEl.style.setProperty('--r', `${rot.r.toFixed(2)}deg`);
  const couronne = $('.roue-couronne .couronne-tourne', section);
  gsap.matchMedia().add({ grand: '(min-width: 761px)', petit: '(max-width: 760px)' }, (ctx) => {
    if (ctx.conditions.grand) {
      section.classList.add('epingle');
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section, start: 'top top', end: () => `+=${Math.round(window.innerHeight * 0.5 * (n - 1))}`,
          pin: true, anticipatePin: 1, scrub: 0.6, invalidateOnRefresh: true,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, delay: 0.1, ease: 'power2.inOut' },
          onUpdate: (st) => activer(Math.round(st.progress * (n - 1))),
        },
      });
      tl.fromTo(rot, { r: 0 }, { r: -pas * (n - 1), ease: 'none', onUpdate: appliquer }, 0);
      if (couronne) tl.fromTo(couronne, { rotation: 0, svgOrigin: '100 100' }, { rotation: -pas * (n - 1) * 0.5, svgOrigin: '100 100', ease: 'none' }, 0);
      return () => section.classList.remove('epingle');
    }
    /* Téléphone : la roue tourne avec le défilement, toutes les cartes sont visibles dessous. */
    const tl = gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 80%', end: 'bottom 30%', scrub: 0.6, onUpdate: (st) => activer(Math.min(n - 1, Math.floor(st.progress * n))) } });
    tl.fromTo(rot, { r: 20 }, { r: -pas * (n - 1) - 20, ease: 'none', onUpdate: appliquer }, 0);
    if (couronne) tl.fromTo(couronne, { rotation: 0, svgOrigin: '100 100' }, { rotation: -90, svgOrigin: '100 100', ease: 'none' }, 0);
    return undefined;
  });
}

/* ---------- fil-du-temps : le fil se tire, chaque date s'allume ---------- */
function fils() {
  $$('[data-fil]').forEach((fil) => {
    const ligne = $('.fil-trait line', fil);
    if (ligne) {
      ligne.setAttribute('pathLength', '1');
      ligne.style.strokeDasharray = '1 1';
      gsap.fromTo(ligne, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: fil, start: 'top 80%', end: 'bottom 60%', scrub: 0.5 } });
    }
    $$('.fil-item', fil).forEach((li) => {
      const p = $('.fil-point', li);
      gsap.fromTo([p, li.querySelector('.fil-date')], { scale: 0.4, autoAlpha: 0.3 }, {
        scale: 1, autoAlpha: 1, ease: 'back.out(2)', duration: 0.6,
        scrollTrigger: { trigger: li, start: 'top 82%', toggleActions: 'play none none none' },
      });
    });
  });
}

/* ---------- carte-lieux : la France se dessine, les lieux s'allument, le tracé circule ---------- */
function cartes() {
  $$('[data-effet="carte-lieux"]').forEach((carte) => {
    const contour = $('.carte-contour', carte), trace = $('.carte-trace', carte), reperes = $$('[data-repere]', carte);
    if (contour) {
      contour.setAttribute('pathLength', '1');
      contour.style.strokeDasharray = '1 1';
      gsap.fromTo(contour, { strokeDashoffset: 1, fillOpacity: 0 }, { strokeDashoffset: 0, fillOpacity: 1, ease: 'none', scrollTrigger: { trigger: carte, start: 'top 85%', end: 'center 50%', scrub: 0.6 } });
    }
    gsap.fromTo(reperes, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, ease: 'back.out(2.2)', stagger: 0.15, scrollTrigger: { trigger: carte, start: 'top 70%', end: 'center 45%', scrub: 0.6 } });
    if (trace) {
      let decal = 0;
      boucle(carte, (dt) => { decal = (decal - dt * 14) % 120; trace.style.strokeDashoffset = decal.toFixed(1); });
    }
  });
}

/* ---------- cercle-de-parole : les témoignages tournent autour du cercle ---------- */
function cercles() {
  $$('[data-cercle]').forEach((cercle) => {
    const anneau = $('.cercle-anneau', cercle);
    const r = { v: 0 };
    const rayon = () => cercle.style.setProperty('--rayon-cercle', `${Math.round(Math.min(cercle.clientWidth * 0.36, cercle.clientHeight * 0.38))}px`);
    rayon();
    new ResizeObserver(rayon).observe(cercle);
    gsap.matchMedia().add('(min-width: 901px)', () => {
      gsap.fromTo(r, { v: 24 }, { v: -36, ease: 'none', onUpdate: () => cercle.style.setProperty('--r', `${r.v.toFixed(2)}deg`), scrollTrigger: { trigger: cercle, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
    });
    if (anneau) gsap.fromTo(anneau, { rotation: 0 }, { rotation: 120, transformOrigin: '50% 50%', ease: 'none', scrollTrigger: { trigger: cercle, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  });
}

/* ---------- bol : les ondes respirent ; au clic, un bol chantant résonne ---------- */
let audio = null;
function sonBol() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  audio = audio || new AC();
  if (audio.state === 'suspended') audio.resume();
  const t0 = audio.currentTime + 0.02;
  const sortie = audio.createGain();
  sortie.gain.setValueAtTime(0.0001, t0);
  sortie.gain.exponentialRampToValueAtTime(0.32, t0 + 0.03);
  sortie.gain.exponentialRampToValueAtTime(0.0001, t0 + 11);
  sortie.connect(audio.destination);
  const f = 196;
  const partiels = [[1, 1, 11], [2.76, 0.5, 8], [5.4, 0.22, 5], [8.93, 0.1, 3]];
  const oscs = [];
  partiels.forEach(([ratio, g, duree]) => {
    [0, 1.6].forEach((detune) => {
      const o = audio.createOscillator(), gg = audio.createGain();
      o.type = 'sine';
      o.frequency.value = f * ratio + detune;
      gg.gain.setValueAtTime(0.0001, t0);
      gg.gain.exponentialRampToValueAtTime(g / 2, t0 + 0.02);
      gg.gain.exponentialRampToValueAtTime(0.0001, t0 + duree);
      o.connect(gg).connect(sortie);
      o.start(t0);
      o.stop(t0 + duree + 0.1);
      oscs.push(o);
    });
  });
  return {
    fin: t0 + 11,
    arreter() {
      const t = audio.currentTime;
      sortie.gain.cancelScheduledValues(t);
      sortie.gain.setValueAtTime(Math.max(sortie.gain.value, 0.0001), t);
      sortie.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      oscs.forEach((o) => { try { o.stop(t + 0.35); } catch {} });
    },
  };
}

function bols() {
  $$('[data-bol]').forEach((bol) => {
    const ondes = $$('.bol-onde', bol);
    const bouton = $('[data-bol-bouton]', bol);
    const etatTexte = $('[data-bol-etat]', bol);
    let force = 0, sonEnCours = null, minuterie = 0;
    /* Respiration lente, toute seule ; plus ample quand le bol sonne. */
    if (!etat.calme) {
      boucle(bol, (dt, t) => {
        force = Math.max(0, force - dt * 0.12);
        ondes.forEach((o, i) => {
          const p = ((t * (0.16 + force * 0.25) + i / ondes.length) % 1);
          const s = 1 + p * (1.6 + force * 1.2);
          o.style.transform = `scale(${s.toFixed(3)})`;
          o.style.opacity = ((1 - p) * (0.55 + force * 0.4)).toFixed(3);
        });
      });
    } else ondes.forEach((o, i) => { o.style.opacity = String(0.5 - i * 0.1); o.style.transform = `scale(${1 + i * 0.35})`; });
    if (!bouton) return;
    const lib = $('[data-libelle-bouton]', bouton);
    const fin = () => {
      clearTimeout(minuterie);
      sonEnCours = null;
      bouton.setAttribute('aria-pressed', 'false');
      lib.textContent = bouton.dataset.libelleEcouter;
      if (etatTexte) etatTexte.textContent = etatTexte.dataset.arrete;
    };
    bouton.addEventListener('click', () => {
      if (sonEnCours) { sonEnCours.arreter(); fin(); return; }
      sonEnCours = sonBol();
      if (!sonEnCours) return;
      force = 1;
      bouton.setAttribute('aria-pressed', 'true');
      lib.textContent = bouton.dataset.libelleArreter;
      if (etatTexte) etatTexte.textContent = etatTexte.dataset.joue;
      minuterie = setTimeout(fin, 11000);
    });
    window.addEventListener('pagehide', () => { if (sonEnCours) { sonEnCours.arreter(); fin(); } });
  });
}


/* ---------- Filtres (formations, agenda, témoignages) : gardés dans l'adresse, fondu sans vide ---------- */
const sansAccents = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const racine = (mot) => mot.replace(/(aux|eaux)$/, 'al').replace(/[sx]$/, '');
const mots = (s) => sansAccents(s).split(/[^a-z0-9®]+/).filter(Boolean).map(racine);

function lireFiltres(form, noms) {
  const p = new URLSearchParams(location.search);
  noms.forEach((n) => {
    const v = p.get(n);
    if (v === null) return;
    form.querySelectorAll(`[name="${n}"]`).forEach((c) => {
      if (c.type === 'radio') c.checked = c.value === v;
      else if (c.type === 'checkbox') c.checked = v === c.value;
      else c.value = v;
    });
  });
}
function valeur(form, n) {
  const c = form.querySelector(`[name="${n}"]:checked`) || form.querySelector(`[name="${n}"]:not([type="radio"]):not([type="checkbox"])`);
  return c ? c.value.trim() : '';
}
function ecrireFiltres(valeurs) {
  const p = new URLSearchParams(location.search);
  Object.entries(valeurs).forEach(([k, v]) => (v ? p.set(k, v) : p.delete(k)));
  const q = p.toString();
  history.replaceState(history.state, '', location.pathname + (q ? '?' + q : '') + location.hash);
}
function compter(el, n) {
  if (!el) return;
  el.textContent = n === 1 ? el.dataset.un : el.dataset.plusieurs.replace('{n}', n);
}
function fondu(cible, appliquer) {
  if (!gsap || etat.calme) { appliquer(); return; }
  gsap.killTweensOf(cible);
  gsap.fromTo(cible, { opacity: 1 }, { opacity: 0.35, duration: 0.14, onComplete: () => { appliquer(); gsap.fromTo(cible, { opacity: 0.35 }, { opacity: 1, duration: 0.3 }); } });
}
function ramener(section) {
  const r = section.getBoundingClientRect();
  if (r.top < 0) window.scrollTo({ top: window.scrollY + r.top - 20, behavior: etat.calme ? 'auto' : 'smooth' });
}

function catalogue() {
  const section = $('[data-catalogue]');
  if (!section) return;
  const form = $('[data-filtres]', section), liste = $('[data-liste-formations]', section);
  const cartes = $$('.carte-formation', liste), vide = $('[data-vide]', section), compte = $('[data-compte]', section);
  cartes.forEach((c) => { c.__mots = mots(c.dataset.texte).join(' '); });
  lireFiltres(form, ['domaine', 'lieu', 'q']);
  const filtrer = (anime = true) => {
    const domaine = valeur(form, 'domaine'), lieu = valeur(form, 'lieu'), q = valeur(form, 'q');
    const cherches = mots(q);
    const appliquer = () => {
      let n = 0;
      cartes.forEach((c) => {
        const ok = (!domaine || c.dataset.domaine === domaine) && (!lieu || c.dataset.lieux.split('|').includes(lieu)) && cherches.every((m) => c.__mots.includes(m));
        c.hidden = !ok;
        if (ok) n++;
      });
      compter(compte, n);
      vide.hidden = n > 0;
      ecrireFiltres({ domaine, lieu, q });
    };
    if (anime) { fondu(liste, appliquer); ramener(section); } else appliquer();
  };
  let t = 0;
  form.addEventListener('change', () => filtrer());
  form.addEventListener('input', (e) => { if (e.target.name === 'q') { clearTimeout(t); t = setTimeout(() => filtrer(), 220); } });
  const effacer = $('[data-effacer]', form);
  if (effacer) effacer.addEventListener('click', () => { form.reset(); filtrer(); });
  filtrer(false);
}

function agenda() {
  const section = $('[data-agenda]');
  if (!section) return;
  const form = $('[data-filtres]', section), items = $$('.fil-item', section), mois = $$('.mois', section);
  const vide = $('[data-vide]', section), compte = $('[data-compte]', section);
  lireFiltres(form, ['type', 'lieu', 'passees']);
  const filtrer = (anime = true) => {
    const type = valeur(form, 'type'), lieu = valeur(form, 'lieu'), passees = !!form.querySelector('[name="passees"]:checked');
    const appliquer = () => {
      let n = 0;
      items.forEach((li) => {
        const ok = (!type || li.dataset.type === type) && (!lieu || li.dataset.lieu === lieu) && (passees || li.dataset.statut !== 'termine');
        li.hidden = !ok;
        if (ok) n++;
      });
      mois.forEach((m) => { m.hidden = !m.querySelector('.fil-item:not([hidden])'); });
      compter(compte, n);
      vide.hidden = n > 0;
      ecrireFiltres({ type, lieu, passees: passees ? 'oui' : '' });
    };
    if (anime) { fondu($('.agenda-mois', section), appliquer); ramener(section); } else appliquer();
  };
  form.addEventListener('change', () => filtrer());
  filtrer(false);
}

function avisFiltre() {
  const section = $('[data-avis]');
  if (!section) return;
  const form = $('[data-filtres]', section), avis = $$('.avis--carte', section), vide = $('[data-vide]', section);
  lireFiltres(form, ['avis']);
  const filtrer = (anime = true) => {
    const cle = valeur(form, 'avis');
    const appliquer = () => {
      let n = 0;
      avis.forEach((a) => { const ok = !cle || a.dataset.cle === cle; a.hidden = !ok; if (ok) n++; });
      vide.hidden = n > 0;
      ecrireFiltres({ avis: cle });
    };
    if (anime) fondu($('.avis-grille', section), appliquer); else appliquer();
  };
  form.addEventListener('change', () => filtrer());
  filtrer(false);
}

/* ---------- Formulaire en 4 étapes : validation par étape, hauteur animée, récapitulatif en direct ---------- */
const MESSAGES = { requis: 'Ce champ est à remplir.', email: 'Adresse e-mail à vérifier (exemple : nom@domaine.fr).', tel: 'Numéro à vérifier (10 chiffres).' };
function erreurChamp(champ, message) {
  const id = 'erreur-' + (champ.id || champ.name);
  let p = document.getElementById(id);
  if (!message) { if (p) p.textContent = ''; champ.removeAttribute('aria-invalid'); return; }
  if (!p) {
    p = document.createElement('p');
    p.id = id; p.className = 'champ-erreur'; p.setAttribute('aria-live', 'polite');
    (champ.closest('.champ') || champ.parentElement).appendChild(p);
    champ.setAttribute('aria-describedby', [champ.getAttribute('aria-describedby'), id].filter(Boolean).join(' '));
  }
  p.textContent = message;
  champ.setAttribute('aria-invalid', 'true');
}
function controle(champ) {
  const v = (champ.value || '').trim();
  if (champ.type === 'radio') return '';
  if (champ.required && !v) return MESSAGES.requis;
  if (v && champ.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return MESSAGES.email;
  if (v && champ.type === 'tel' && v.replace(/[^\d]/g, '').length < 9) return MESSAGES.tel;
  return '';
}

function formulaireEtapes() {
  const form = $('[data-etapes]');
  if (!form) return;
  const etapes = $$('.etape', form), nav = $('[data-navigation]', form);
  const prec = $('[data-precedent]', form), suiv = $('[data-suivant]', form);
  const reperes = $$('[data-reperes] li');
  let n = 0;
  form.setAttribute('data-etapes-actives', '');
  nav.hidden = false;
  const montrer = (i, focus = true) => {
    const h0 = form.offsetHeight;
    etapes.forEach((e, k) => e.classList.toggle('est-active', k === i));
    reperes.forEach((r, k) => { r.classList.toggle('est-actif', k === i); r.classList.toggle('est-fait', k < i); });
    prec.hidden = i === 0;
    suiv.hidden = i === etapes.length - 1;
    n = i;
    if (gsap && !etat.calme) {
      const h1 = form.offsetHeight;
      gsap.fromTo(form, { height: h0 }, { height: h1, duration: 0.45, ease: 'power3.out', clearProps: 'height' });
      gsap.fromTo(etapes[i], { opacity: 0, x: 18 }, { opacity: 1, x: 0, duration: 0.4, clearProps: 'transform,opacity' });
    }
    if (focus) { const l = $('legend', etapes[i]); if (l) { l.setAttribute('tabindex', '-1'); l.focus({ preventScroll: true }); } }
    recap();
  };
  const valider = (i) => {
    let premier = null;
    $$('input, select, textarea', etapes[i]).forEach((c) => { const m = controle(c); erreurChamp(c, m); if (m && !premier) premier = c; });
    if (premier) premier.focus();
    return !premier;
  };
  suiv.addEventListener('click', () => { if (valider(n)) montrer(Math.min(n + 1, etapes.length - 1)); });
  prec.addEventListener('click', () => montrer(Math.max(n - 1, 0)));
  form.addEventListener('input', (e) => { if (e.target.getAttribute('aria-invalid')) erreurChamp(e.target, controle(e.target)); recap(); });
  form.addEventListener('change', recap);
  /* Entrée dans un champ : passe à l'étape suivante plutôt que d'envoyer le formulaire. */
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && n < etapes.length - 1) { e.preventDefault(); suiv.click(); }
  });
  function texteDe(nom) {
    const c = form.querySelector(`[name="${nom}"]:checked`) || form.querySelector(`select[name="${nom}"]`);
    if (!c) return '';
    if (c.tagName === 'SELECT') return c.value ? c.options[c.selectedIndex].text : '';
    const l = c.closest('label');
    return l ? l.textContent.trim() : c.value;
  }
  function recap() {
    const v = (nom) => (form.querySelector(`[name="${nom}"]`) || {}).value || '';
    let noms = ['Demande', 'Formation', 'Option', 'Lieu', 'Coordonnées'];
    try { noms = JSON.parse($('[data-recap]').dataset.libelles); } catch {}
    const lignes = [
      [noms[0], texteDe('sujet')],
      [noms[1], texteDe('formation')],
      [noms[2], texteDe('option')],
      [noms[3], texteDe('lieu')],
      [noms[4], [v('prenom') + ' ' + v('nom'), v('email'), v('tel')].map((x) => x.trim()).filter(Boolean).join(' · ')],
    ].filter(([, x]) => x);
    $$('[data-recap], [data-recap-final]').forEach((dl) => {
      dl.replaceChildren(...lignes.map(([t, x]) => { const d = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = t; dd.textContent = x; d.append(dt, dd); return d; }));
    });
  }
  montrer(0, false);
}

/* ---------- Intro : couronne, lueur, oculus sur la yourte, SENSORIA lettre par lettre ---------- */
function intro() {
  if (!gsap) return null;
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  const g = '.ouverture-couronne .couronne-tourne';
  tl.fromTo(g, { rotation: -50, scale: 0.86, svgOrigin: '100 100' }, { rotation: 0, scale: 1, svgOrigin: '100 100', duration: 1.5, ease: 'power2.inOut' }, 0)
    .fromTo('.ouverture-couronne .couronne-rayon', { opacity: 0.25 }, { opacity: 1, duration: 0.5, stagger: { each: 0.012, from: 'random' } }, 0.1)
    .fromTo('.ouverture-lueur', { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.6 }, 0.35)
    .fromTo('.ouverture-oculus', { clipPath: 'circle(0% at 50% 44%)' }, { clipPath: 'circle(9% at 50% 44%)', duration: 0.55, ease: 'power2.out' }, 0.8)
    .fromTo('.ouverture-lettre', { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.05 }, 1.05)
    .fromTo('.ouverture-ligne', { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 1.4)
    .fromTo('.ouverture-oculus', { clipPath: 'circle(9% at 50% 44%)' }, { clipPath: 'circle(42% at 50% 44%)', duration: 0.6, ease: 'power3.in', immediateRender: false }, 1.6)
    .fromTo('.ouverture-panneau', { opacity: 1 }, { opacity: 0, duration: 0.42, ease: 'power1.in' }, 1.9);
  /* Partie propre à la page : premier écran. */
  if ($('.hero-ligne')) {
    tl.fromTo('.hero-marque', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, 1.95)
      .fromTo('.hero-ligne', { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.1 }, 1.95)
      .fromTo('.hero-intro, .hero-actions, .hero-info', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 2.15);
  } else if ($('.tete-ligne')) {
    tl.fromTo('.tete-ligne', { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08 }, 1.95)
      .fromTo('.tete-suite', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 2.1);
  }
  return tl;
}

function premierEcranFinal() {
  gsap.set('.hero-marque, .hero-ligne, .hero-intro, .hero-actions, .hero-info, .tete-ligne, .tete-suite', { clearProps: 'transform,opacity' });
}

demarrer({
  preparer() {
    majDates();
    setInterval(majDates, 60 * 60 * 1000);
    calerCouronneHero();
    bols();
    catalogue();
    agenda();
    avisFiltre();
    formulaireEtapes();
    if (!anime()) return;
    couronnes();
    oculus();
    roue();
    /* Effets plus bas dans la page : préparés après l'ouverture, pendant un temps mort (calcul au chargement allégé). */
    const plusTard = () => { infinis(); fils(); cartes(); cercles(); };
    quand('pret', () => (window.requestIdleCallback ? requestIdleCallback(plusTard, { timeout: 1200 }) : setTimeout(plusTard, 300)));
  },
  jouer: intro,
  etatFinal() {
    if (!gsap) return;
    premierEcranFinal();
    gsap.set('.ouverture-panneau', { clearProps: 'opacity' });
  },
  arrivee() {
    if (!gsap) return;
    if ($('.hero-ligne')) {
      gsap.fromTo('.hero-marque', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.1 });
      gsap.fromTo('.hero-ligne', { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: 'power3.out', delay: 0.1 });
      gsap.fromTo('.hero-intro, .hero-actions, .hero-info', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.3 });
    }
    if ($('.tete-ligne')) {
      gsap.fromTo('.tete-ligne', { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.1 });
      gsap.fromTo('.tete-suite', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.25 });
    }
  },
});
