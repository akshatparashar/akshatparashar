// Builds the static panels of the profile README into /assets.
import { T, measure, wrap, svg, save, frame, header, tag, C, reportMissing } from './lib.mjs';
import { player, matches, roles, nightMarket } from './data.mjs';

// Akshat's own mark, lifted from the portfolio client (viewBox 0 0 100 100).
const LOGO = 'M8 92L42 8H60L26 92ZM48 92L58 66H76L66 92ZM62 8H78Q96 8 96 27Q96 46 78 46H62L68 32H76Q81 32 81 27Q81 22 76 22H57Z';

const W = 1000;

/* ------------------------------------------------------------------ HERO */
function hero() {
  const H = 520;
  const nameX = 316;
  const first = T(player.first, { x: nameX, y: 238, font: 'display', size: 132, fill: C.bone, ls: 2 });
  const firstW = measure(player.first, { font: 'display', size: 132, ls: 2 });
  const lastPath = T(player.last, { x: nameX, y: 362, font: 'display', size: 132, fill: 'none', ls: 2,
    sw: 1.6, attrs: `stroke="${C.bone}" stroke-opacity=".9"` });

  // ticker: role words separated by small diamonds
  let tx = 0, tick = '';
  const words = [...player.roles, ...player.roles];
  for (const w of [...words, ...words]) {
    tick += T(w, { x: tx, y: 22, font: 'condB', size: 17, fill: C.ink, ls: 3 });
    tx += measure(w, { font: 'condB', size: 17, ls: 3 }) + 16;
    tick += `<rect x="${tx}" y="11" width="7" height="7" fill="${C.ink}" transform="rotate(45 ${tx + 3.5} 14.5)"/>`;
    tx += 7 + 18;
  }
  const loop = tx / 2;

  // top bar currencies
  let sx = W - 48, stats = '';
  for (const [v, l] of [...player.stats].reverse()) {
    const lw = measure(l, { font: 'cond', size: 12, ls: 1.5 });
    stats += T(l, { x: sx, y: 44, font: 'cond', size: 12, fill: C.muted, ls: 1.5, anchor: 'end' });
    stats += T(v, { x: sx - lw - 8, y: 45, font: 'condB', size: 18, fill: C.gold2, anchor: 'end' });
    sx -= lw + 8 + measure(v, { font: 'condB', size: 18 }) + 28;
  }

  const chips = [`${player.title} @ ${player.company}`, player.city, 'CLASS OF 2026', "OPEN TO WORK '26"];
  let cx = nameX + 2, chipRow = '';
  chips.forEach((c, i) => {
    const w = measure(c, { font: 'cond', size: 14, ls: 2 }) + 26;
    const hot = i === 0;
    chipRow += tag(cx, 392, w, 30, hot ? C.red : 'rgba(236,232,225,.06)', 7, hot ? '' : `stroke="${C.line}"`);
    chipRow += T(c, { x: cx + 13, y: 412, font: 'cond', size: 14, fill: hot ? '#fff' : C.bone, ls: 2 });
    cx += w + 8;
  });

  const body = frame(W, H, `
  <defs>
    <clipPath id="clip"><rect width="${W}" height="${H}" rx="14"/></clipPath>
    <linearGradient id="card" x1=".2" y1="0" x2=".8" y2="1">
      <stop offset="0" stop-color="#3b2c7a"/><stop offset=".4" stop-color="#6d2f7a"/><stop offset=".75" stop-color="#d24b5a"/><stop offset="1" stop-color="#f2a254"/>
    </linearGradient>
    <radialGradient id="cardglow" cx=".5" cy=".38" r=".45">
      <stop offset="0" stop-color="#ff7a59" stop-opacity=".55"/><stop offset="1" stop-color="#ff7a59" stop-opacity="0"/>
    </radialGradient>
    <pattern id="stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
      <rect width="2" height="10" fill="rgba(255,255,255,.07)"/>
    </pattern>
    <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="cardclip"><path d="M48 80H278V396L254 420H48Z"/></clipPath>
    <radialGradient id="glow" cx=".7" cy=".35" r=".6">
      <stop offset="0" stop-color="${C.red}" stop-opacity=".16"/><stop offset="1" stop-color="${C.red}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g clip-path="url(#clip)">
    <!-- giant ghost level number -->
    ${T(String(player.level), { x: W + 30, y: 470, font: 'display', size: 430, fill: 'none', anchor: 'end',
      sw: 2, attrs: `stroke="${C.bone}" stroke-opacity=".05"` })}
    <rect class="scan" x="0" y="0" width="${W}" height="2" fill="${C.bone}" opacity=".06"/>
  </g>

  <!-- top bar -->
  <rect x="44" y="34" width="8" height="8" fill="${C.red}" transform="rotate(45 48 38)"/>
  ${T('AKSHAT // CLIENT', { x: 62, y: 44, font: 'condB', size: 13, fill: C.bone, ls: 3 })}
  <circle class="pulse" cx="${62 + measure('AKSHAT // CLIENT', { font: 'condB', size: 13, ls: 3 }) + 22}" cy="39" r="4" fill="${C.green}"/>
  ${T('ONLINE  ·  IN LOBBY', { x: 62 + measure('AKSHAT // CLIENT', { font: 'condB', size: 13, ls: 3 }) + 32, y: 44, font: 'cond', size: 13, fill: C.green, ls: 2 })}
  ${stats}
  <rect x="48" y="60" width="${W - 96}" height="1" fill="${C.line}"/>

  <!-- player card -->
  <g class="rise" style="animation-delay:.05s">
    <path d="M48 80H278V396L254 420H48Z" fill="url(#card)"/>
    <path d="M48 80H278V396L254 420H48Z" fill="url(#cardglow)"/>
    <path d="M48 80H278V396L254 420H48Z" fill="url(#stripes)"/>
    <g clip-path="url(#cardclip)"><rect class="shine" x="-160" y="60" width="120" height="380" fill="url(#shine)" transform="skewX(-18)"/></g>
    <!-- crest -->
    <g transform="translate(163 196)">
      <rect x="-70" y="-70" width="140" height="140" fill="none" stroke="${C.bone}" stroke-opacity=".35" transform="rotate(45)"/>
      <g class="spin"><path d="M0 -98V-84M0 84V98M-98 0H-84M84 0H98" stroke="${C.bone}" stroke-width="2"/></g>
      <path d="${LOGO}" fill="#fff" transform="translate(-52 -52) scale(1.04)"/>
    </g>
    <!-- level badge -->
    <path d="M232 92l18 10v20l-18 10-18-10v-20z" fill="${C.ink}" stroke="${C.gold}" stroke-width="1.5"/>
    ${T(String(player.level), { x: 232, y: 120, font: 'condB', size: 17, fill: C.gold2, anchor: 'middle' })}
    <!-- plate -->
    ${T('READY', { x: 163, y: 318, font: 'condB', size: 15, fill: C.teal, ls: 4, anchor: 'middle' })}
    <rect x="48" y="327" width="230" height="3" fill="${C.teal}"/>
    <path d="M48 330H278V396L254 420H48Z" fill="${C.ink}" fill-opacity=".9"/>
    ${T(player.first, { x: 64, y: 368, font: 'display', size: 30, fill: C.bone, ls: 1 })}
    ${T(player.tag, { x: 64 + measure(player.first, { font: 'display', size: 30, ls: 1 }) + 8, y: 368, font: 'condB', size: 16, fill: C.gold2, ls: 1 })}
    ${T(`${player.title}  ·  LVL ${player.level}`, { x: 64, y: 396, font: 'cond', size: 13, fill: C.muted, ls: 2 })}
  </g>

  <!-- name -->
  <g class="rise" style="animation-delay:.18s">
    ${T('AGENT  //  PLAYER CARD', { x: nameX + 4, y: 104, font: 'condB', size: 14, fill: C.red, ls: 4 })}
  </g>
  <g class="rise" style="animation-delay:.28s">${first}
    ${T(player.tag, { x: nameX + firstW + 16, y: 236, font: 'condB', size: 30, fill: C.gold2, ls: 1 })}
  </g>
  <g class="rise" style="animation-delay:.4s">${lastPath}</g>
  <rect class="slash" x="${nameX - 40}" y="128" width="64" height="248" fill="${C.red}" transform="skewX(-14)"/>

  <g class="rise" style="animation-delay:.55s">${chipRow}</g>
  <g class="rise" style="animation-delay:.7s">
    ${T(player.hype, { x: nameX + 2, y: 452, font: 'body', size: 17, fill: C.muted })}
  </g>

  <!-- ticker -->
  <g clip-path="url(#clip)">
    <rect x="0" y="474" width="${W}" height="46" fill="${C.red}"/>
    <g transform="translate(0 482)"><g class="tick">${tick}</g></g>
  </g>`);

  const style = `
  .rise{opacity:0;animation:rise .9s cubic-bezier(.2,.8,.2,1) forwards}
  @keyframes rise{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}
  .slash{opacity:0;animation:slash 1.1s cubic-bezier(.7,0,.2,1) .2s forwards}
  @keyframes slash{0%{opacity:1;transform:translateX(0) skewX(-14deg)}100%{opacity:0;transform:translateX(640px) skewX(-14deg)}}
  .tick{animation:tick 34s linear infinite}
  @keyframes tick{to{transform:translateX(-${loop.toFixed(1)}px)}}
  .pulse{animation:pulse 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes pulse{50%{opacity:.35;transform:scale(.7)}}
  .scan{animation:scan 7s linear infinite}
  @keyframes scan{from{transform:translateY(0)}to{transform:translateY(${H}px)}}
  .shine{animation:shine 6s ease-in-out 1.4s infinite}
  @keyframes shine{0%{transform:translateX(0) skewX(-18deg)}35%,100%{transform:translateX(560px) skewX(-18deg)}}
  .spin{animation:spin 24s linear infinite;transform-origin:0 0}
  @keyframes spin{to{transform:rotate(360deg)}}`;
  save('assets/hero.svg', svg(W, H, body, { title: 'Akshat Parashar #AI26, AI Engineer at FLO, Jaipur', style }));
}

/* ------------------------------------------------------------------ NAV TABS */
function tabs() {
  const items = [['PLAY', true], ['CAREER'], ['AGENTS'], ['COLLECTION'], ['NIGHT MARKET'], ['STATS']];
  for (const [label, hot] of items) {
    const tw = measure(label, { font: 'condB', size: 15, ls: 3 });
    const w = Math.round(tw + 40), h = 42;
    if (hot) {
      const pw = Math.round(measure(label, { font: 'display', size: 22, ls: 1 }) + 62);
      const body = `<path d="M0 0H${pw}L${pw - 14} ${h}H0Z" fill="${C.bone}"/>
        <path d="${LOGO}" fill="${C.red}" transform="translate(12 9) scale(.24)"/>
        ${T(label, { x: 42, y: 31, font: 'display', size: 22, fill: C.ink, ls: 1 })}`;
      save('assets/tab-play.svg', svg(pw, h, body, { title: 'Play' }));
      continue;
    }
    const body = hot
      ? ''
      : `<rect width="${w}" height="${h}" fill="${C.navy}"/><rect y="${h - 2}" width="${w}" height="2" fill="${C.navy3}"/>
         ${T(label, { x: w / 2, y: 27, font: 'condB', size: 15, fill: C.bone, ls: 3, anchor: 'middle' })}`;
    save(`assets/tab-${label.toLowerCase().replace(' ', '-')}.svg`, svg(w, h, body, { title: label }));
  }
}

/* ------------------------------------------------------------------ CAREER / MATCH HISTORY */
function career() {
  const rowH = 86, gap = 10, top = 160;
  const H = top + matches.length * (rowH + gap) + 40;
  let rows = '';
  matches.forEach((m, i) => {
    const y = top + i * (rowH + gap);
    const live = m.result === 'LIVE';
    let r = `<rect x="48" y="${y}" width="${W - 96}" height="${rowH}" fill="${live ? 'rgba(46,230,182,.07)' : 'rgba(236,232,225,.03)'}"/>
      <rect x="48" y="${y}" width="4" height="${rowH}" fill="${m.color}"/>`;
    r += T(m.result, { x: 68, y: y + 38, font: 'display', size: 22, fill: m.result === 'GRADUATED' || m.result === 'CLEARED' ? C.gold2 : (live ? C.teal : C.green), ls: 1.5 });
    if (live) r += `<circle class="pulse" cx="${68 + measure('LIVE', { font: 'display', size: 22, ls: 1.5 }) + 12}" cy="${y + 30}" r="4.5" fill="${C.teal}"/>`;
    r += T(m.dates, { x: 68, y: y + 64, font: 'cond', size: 13, fill: C.muted, ls: 1.5 });
    // org badge
    r += tag(206, y + 19, 48, 48, m.color + '22', 10, `stroke="${m.color}" stroke-opacity=".7"`);
    r += T(m.abbr, { x: 230, y: y + 50, font: 'display', size: 17, fill: m.color, anchor: 'middle', ls: 1 });
    // role + org
    r += T(m.role, { x: 274, y: y + 40, font: 'display', size: 24, fill: C.bone, ls: .5 });
    const rw = measure(m.role, { font: 'display', size: 24, ls: .5 });
    r += T(m.org.toUpperCase(), { x: 274 + rw + 14, y: y + 39, font: 'cond', size: 14, fill: C.muted, ls: 1.5 });
    const orgEnd = 274 + rw + 14 + measure(m.org.toUpperCase(), { font: 'cond', size: 14, ls: 1.5 });
    r += T(m.line, { x: 275, y: y + 66, font: 'body', size: 14.5, fill: '#b9c0c7' });
    // chips, right aligned on the role line; drop the tail if they would collide
    let cx = W - 64, chips = '', placed = [];
    for (const s of [...m.stack].reverse()) {
      const w = measure(s, { font: 'cond', size: 12.5, ls: 1 }) + 16;
      if (cx - w < orgEnd + 24) break;
      placed.push([s, cx - w, w]); cx -= w + 6;
    }
    for (const [s, x, w] of placed) {
      chips += `<rect x="${x}" y="${y + 20}" width="${w}" height="22" fill="rgba(236,232,225,.05)" stroke="${C.line}"/>`;
      chips += T(s, { x: x + 8, y: y + 35.5, font: 'cond', size: 12.5, fill: '#c9cfd5', ls: 1 });
    }
    rows += `<g class="row" style="animation-delay:${(0.12 + i * 0.1).toFixed(2)}s">${r}${chips}</g>`;
  });
  const body = frame(W, H, header({ idx: '02', kicker: 'CAREER', title: 'MATCH HISTORY', right: '4 WINS  ·  0 LOSSES  ·  1 LIVE' }) + rows);
  const style = `
  .row{opacity:0;animation:row .7s cubic-bezier(.2,.8,.2,1) forwards}
  @keyframes row{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:none}}
  .pulse{animation:pulse 1.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes pulse{50%{opacity:.3;transform:scale(.6)}}`;
  save('assets/career.svg', svg(W, H, body, { title: 'Match history: AI Engineer at FLO (live), DevOps Intern at Celebal Technologies, UI/UX Designer at GreyMoon, Web Designer at InternPay, B.Tech CSE at Poornima College of Engineering', style }));
}

/* ------------------------------------------------------------------ AGENTS / SKILLS */
const icons = {
  lang: (c) => `<path d="M14 0L2 16h9l-3 12 12-17h-9z" fill="${c}"/>`,
  web: (c) => `<circle cx="13" cy="14" r="12" fill="none" stroke="${c}" stroke-width="2"/><circle cx="13" cy="14" r="6" fill="none" stroke="${c}" stroke-width="1.5" stroke-opacity=".6"/><path d="M13 14L23 6" stroke="${c}" stroke-width="2"/><circle cx="13" cy="14" r="2.5" fill="${c}"/>`,
  ai: (c) => `<circle cx="11" cy="16" r="9" fill="${c}" fill-opacity=".35"/><circle cx="18" cy="11" r="9" fill="${c}" fill-opacity=".55"/><circle cx="16" cy="15" r="4" fill="${c}"/>`,
  devops: (c) => `<path d="M13 1l11 4v8c0 7-5 12-11 15C7 25 2 20 2 13V5z" fill="none" stroke="${c}" stroke-width="2"/><path d="M8 14l4 4 7-8" fill="none" stroke="${c}" stroke-width="2.2"/>`,
  design: (c) => `<path d="M13 1l12 13-12 13L1 14z" fill="none" stroke="${c}" stroke-width="2"/><circle cx="13" cy="14" r="4" fill="${c}"/>`,
};

function agents() {
  const top = 160, gap = 12, cw = (W - 96 - gap * 4) / 5, cardH = 112, rowH = 31;
  const maxRows = Math.max(...roles.map((r) => r.skills.length));
  const H = top + cardH + 18 + maxRows * rowH + 74;
  let cols = '', defs = '';
  roles.forEach((r, i) => {
    const x = 48 + i * (cw + gap);
    defs += `<linearGradient id="g${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${r.bg[1]}"/><stop offset="1" stop-color="${r.bg[0]}"/></linearGradient>`;
    let c = `${tag(x, top, cw, cardH, `url(#g${i})`, 14)}
      <path d="M${x} ${top}H${x + cw}" stroke="${r.color}" stroke-width="3"/>
      <g transform="translate(${x + 16} ${top + 18})">${icons[r.key](r.color)}</g>
      ${T(`0${i + 1}`, { x: x + cw - 16, y: top + 34, font: 'condB', size: 14, fill: r.color, ls: 2, anchor: 'end', attrs: 'opacity=".7"' })}
      ${T(r.role, { x: x + 16, y: top + 72, font: 'condB', size: 14, fill: r.color, ls: 3 })}
      ${T(r.name, { x: x + 16, y: top + 100, font: 'display', size: 26, fill: C.bone, ls: 1 })}`;
    r.skills.forEach(([name, m], j) => {
      const y = top + cardH + 18 + j * rowH;
      c += `<rect x="${x}" y="${y}" width="${cw}" height="${rowH - 4}" fill="rgba(236,232,225,${j % 2 ? '.02' : '.045'})"/>`;
      c += T(name, { x: x + 10, y: y + 19, font: 'cond', size: 14.5, fill: C.bone, ls: .5 });
      for (let k = 0; k < 5; k++) {
        const px = x + cw - 10 - (5 - k) * 11;
        const on = k < m;
        c += `<path d="M${px + 3} ${y + 8}h7l-3 11h-7z" fill="${on ? r.color : 'rgba(236,232,225,.13)'}" ${on ? `class="pip" style="animation-delay:${(0.3 + i * 0.12 + j * 0.05 + k * 0.04).toFixed(2)}s"` : ''}/>`;
      }
    });
    cols += `<g class="col" style="animation-delay:${(0.08 + i * 0.1).toFixed(2)}s">${c}</g>`;
  });
  const foot = T('MASTERY IS SELF-RATED ON A 1-5 SCALE   ·   MAINS: AI ENGINEER  /  FULL-STACK  /  UI-UX', { x: 48, y: H - 34, font: 'cond', size: 13, fill: C.dim, ls: 2 });
  const body = frame(W, H, `<defs>${defs}</defs>` + header({ idx: '03', kicker: 'SKILLS', title: 'SELECT YOUR AGENT', right: '5 ROLES  ·  31 ABILITIES' }) + cols + foot);
  const style = `
  .col{opacity:0;animation:col .8s cubic-bezier(.2,.8,.2,1) forwards}
  @keyframes col{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
  .pip{animation:pip .4s ease-out backwards}
  @keyframes pip{from{opacity:0}}`;
  save('assets/agents.svg', svg(W, H, body, { title: 'Skills as agent roles: Languages, Web, AI/ML, DevOps and Design, each skill with a 1 to 5 mastery rating', style }));
}

/* ------------------------------------------------------------------ COLLECTION HEADER */
function collectionHeader() {
  const H = 150;
  const body = frame(W, H, header({ idx: '04', kicker: 'PROJECTS', title: 'COLLECTION', right: '8 SKINS  ·  CLICK ONE TO EQUIP' }));
  save('assets/collection.svg', svg(W, H, body, { title: 'Projects collection' }));
}

/* ------------------------------------------------------------------ NIGHT MARKET */
function market() {
  const top = 162, gap = 12, n = nightMarket.length, cw = (W - 96 - gap * (n - 1)) / n, ch = 236;
  const H = top + ch + 56;
  let cards = '';
  nightMarket.forEach((m, i) => {
    const x = 48 + i * (cw + gap), y = top;
    const d = (0.6 + i * 0.32).toFixed(2);
    let face = `${tag(x, y, cw, ch, C.navy3, 14)}
      <rect x="${x}" y="${y}" width="${cw}" height="3" fill="${C.red}"/>
      ${tag(x + 12, y + 16, 54, 24, C.red, 6)}
      ${T(`-${m.off}%`, { x: x + 39, y: y + 33, font: 'condB', size: 15, fill: '#fff', anchor: 'middle', ls: 1 })}`;
    wrap(m.title, cw - 24, { font: 'display', size: 20, ls: .5 }).forEach((l, k) => {
      face += T(l, { x: x + 12, y: y + 74 + k * 24, font: 'display', size: 20, fill: C.bone, ls: .5 });
    });
    const tl = wrap(m.title, cw - 24, { font: 'display', size: 20, ls: .5 }).length;
    wrap(m.fact, cw - 24, { font: 'body', size: 13.5 }).forEach((l, k) => {
      face += T(l, { x: x + 12, y: y + 84 + tl * 24 + k * 19, font: 'body', size: 13.5, fill: '#aeb6be' });
    });
    face += T('FREE', { x: x + cw - 12, y: y + ch - 16, font: 'condB', size: 15, fill: C.gold2, ls: 2, anchor: 'end' });
    face += T(`${100 - m.off}%`, { x: x + 12, y: y + ch - 16, font: 'cond', size: 13, fill: C.dim, ls: 1, attrs: '' });
    face += `<rect x="${x + 12}" y="${y + ch - 21}" width="${measure(`${100 - m.off}%`, { font: 'cond', size: 13, ls: 1 })}" height="1.2" fill="${C.dim}"/>`;
    const back = `${tag(x, y, cw, ch, C.red, 14)}
      <rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="url(#dia)" opacity=".5"/>
      <rect x="${x + cw / 2 - 26}" y="${y + ch / 2 - 26}" width="52" height="52" fill="${C.ink}" transform="rotate(45 ${x + cw / 2} ${y + ch / 2})"/>
      ${T('?', { x: x + cw / 2, y: y + ch / 2 + 15, font: 'display', size: 40, fill: C.bone, anchor: 'middle' })}`;
    cards += `<g class="back" style="animation-delay:${d}s">${back}</g><g class="face" style="animation-delay:${d}s">${face}</g>`;
  });
  const defs = `<defs><pattern id="dia" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="${C.ink}" opacity=".25"/></pattern></defs>`;
  const body = frame(W, H, defs + header({ idx: '06', kicker: 'EXTRAS', title: 'NIGHT MARKET', right: '6 OFFERS  ·  RELOAD TO FLIP AGAIN' }) + cards);
  const style = `
  .back,.face{transform-box:fill-box;transform-origin:center}
  .back{animation:out .28s ease-in forwards}
  .face{transform:scaleX(0);animation:in .3s ease-out forwards}
  @keyframes out{to{transform:scaleX(0)}}
  @keyframes in{0%,48%{transform:scaleX(0)}100%{transform:scaleX(1)}}
  .face{animation-duration:.56s}`;
  save('assets/night-market.svg', svg(W, H, body, { title: 'Night market of fun facts: pocket server, 93.4% in Class XII, plays VALORANT, based in Jaipur, AI Engineer at FLO, speaks English and Hindi', style }));
}

/* ------------------------------------------------------------------ FIND MATCH */
function findMatch() {
  const H = 250;
  const bx = 600, by = 70, bw = 340, bh = 92;
  const body = frame(W, H, `
  ${T('READY TO QUEUE?', { x: 64, y: 118, font: 'display', size: 60, fill: C.bone, ls: 1 })}
  ${T('Hiring, collaborations and freelance builds. The lobby is open.', { x: 66, y: 152, font: 'body', size: 17, fill: C.muted })}
  ${T('MODE  ·  AI ENGINEERING  /  FULL-STACK  /  UI-UX', { x: 66, y: 190, font: 'condB', size: 14, fill: C.red, ls: 3 })}
  <g class="ring"><path d="M${bx - 8} ${by - 8}H${bx + bw + 8}V${by + bh - 12}L${bx + bw - 12} ${by + bh + 8}H${bx - 8}Z" fill="none" stroke="${C.red}" stroke-width="1.5"/></g>
  ${tag(bx, by, bw, bh, C.red, 18)}
  <rect class="sheen" x="${bx}" y="${by}" width="60" height="${bh}" fill="#fff" opacity=".18" transform="skewX(-20)"/>
  <g transform="translate(${bx + 52} ${by + bh / 2})" stroke="#fff" stroke-width="2.4" fill="none">
    <circle r="16"/><path d="M0 -26V-9M0 9V26M-26 0H-9M9 0H26"/>
  </g>
  ${T('FIND MATCH', { x: bx + 92, y: by + 60, font: 'display', size: 40, fill: '#fff', ls: 2 })}
  ${T('PRESS TO SEND AN EMAIL', { x: bx + bw / 2, y: by + bh + 40, font: 'cond', size: 13, fill: C.dim, ls: 3, anchor: 'middle' })}
  `);
  const style = `
  .ring{transform-box:fill-box;transform-origin:center;animation:ring 1.8s ease-out infinite}
  @keyframes ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(1.09,1.35)}}
  .sheen{animation:sheen 3.2s ease-in-out infinite}
  @keyframes sheen{0%{transform:translateX(-80px) skewX(-20deg);opacity:0}10%{opacity:.18}45%,100%{transform:translateX(380px) skewX(-20deg);opacity:0}}`;
  save('assets/find-match.svg', svg(W, H, body, { title: 'Find match: email Akshat about hiring, collaborations or freelance work', style }));
}

/* ------------------------------------------------------------------ SOCIAL BUTTONS */
function socials() {
  const items = ['PORTFOLIO', 'LINKEDIN', 'RESUME', 'EMAIL', 'INSTAGRAM'];
  for (const s of items) {
    const w = Math.round(measure(s, { font: 'condB', size: 14, ls: 3 }) + 54), h = 40;
    const body = `${tag(0, 0, w, h, C.navy, 10)}<path d="M.5 .5H${w - .5}V${h - 10}L${w - 10} ${h - .5}H.5Z" fill="none" stroke="rgba(236,232,225,.22)"/>
      <rect x="16" y="${h / 2 - 4}" width="8" height="8" fill="${C.red}" transform="rotate(45 20 ${h / 2})"/>
      ${T(s, { x: 34, y: 25.5, font: 'condB', size: 14, fill: C.bone, ls: 3 })}`;
    save(`assets/btn-${s.toLowerCase()}.svg`, svg(w, h, body, { title: s }));
  }
}

/* ------------------------------------------------------------------ FOOTER */
function footer() {
  const H = 96;
  const body = frame(W, H, `
  ${T('GG', { x: 48, y: 64, font: 'display', size: 40, fill: C.red, ls: 2 })}
  ${T('AKSHAT PARASHAR  ·  DESIGN  ·  CODE  ·  INTELLIGENCE  ·  JAIPUR', { x: 112, y: 58, font: 'condB', size: 14, fill: C.bone, ls: 3 })}
  ${T('FAN-MADE THEME  ·  NOT AFFILIATED WITH RIOT GAMES', { x: W - 48, y: 58, font: 'cond', size: 12, fill: C.dim, ls: 2, anchor: 'end' })}`);
  save('assets/footer.svg', svg(W, H, body, { title: 'GG. Akshat Parashar, Jaipur. Fan-made theme, not affiliated with Riot Games.' }));
}

console.log('Building panels');
hero(); tabs(); career(); agents(); collectionHeader(); market(); findMatch(); socials(); footer();
reportMissing();
