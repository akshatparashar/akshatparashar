// Renders each project as a weapon-skin card (HTML -> WebP) with headless Chromium.
// Run locally after changing projects in data.mjs: `npm run cards`.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { projects, tiers } from './data.mjs';
import { ROOT } from './lib.mjs';

const here = join(ROOT, 'scripts');
const font = (name, file) => `@font-face{font-family:"${name}";src:url("file://${here}/fonts/${file}")}`;

const phone = `<div class="phone"><div class="scr">
  <p><b>u0_a54@pocket</b>:~$ uname -m</p><p class="m">aarch64</p>
  <p><b>u0_a54@pocket</b>:~$ nginx -t</p><p class="ok">syntax ok, test successful</p>
  <p><b>u0_a54@pocket</b>:~$ curl -I localhost</p><p class="ok">HTTP/1.1 200 OK</p>
  <p><b>u0_a54@pocket</b>:~$ <span class="cur"></span></p></div></div>`;

const css = `
${font('Anton', 'Anton-Regular.ttf')}${font('BC', 'BarlowCondensed-SemiBold.ttf')}${font('BCB', 'BarlowCondensed-Bold.ttf')}${font('Barlow', 'Barlow-Medium.ttf')}
*{box-sizing:border-box;margin:0}
body{background:transparent;width:520px}
.card{--t:#fff;position:relative;width:520px;height:576px;overflow:hidden;color:#ece8e1;
  background:linear-gradient(165deg,#1c2a38 0%,#13202c 45%,#0b131b 100%);
  clip-path:polygon(0 0,100% 0,100% calc(100% - 30px),calc(100% - 30px) 100%,0 100%);font-family:Barlow}
.card:before{content:"";position:absolute;inset:0;background:radial-gradient(120% 60% at 100% 0%,color-mix(in srgb,var(--t) 22%,transparent),transparent 60%);pointer-events:none}
.edge{position:absolute;left:0;top:0;right:0;height:4px;background:var(--t)}
.top{display:flex;justify-content:space-between;align-items:center;padding:22px 26px 0;font:14px BCB;letter-spacing:.2em}
.slot{color:#8a96a3}.slot b{color:#ece8e1;font-weight:normal}
.tier{display:flex;gap:8px;align-items:center;color:var(--t)}
.gem{width:11px;height:11px;background:var(--t);transform:rotate(45deg);box-shadow:0 0 12px var(--t)}
.shot{position:relative;margin:18px 26px 0;height:262px;overflow:hidden;border:1px solid rgba(236,232,225,.16);background:#0a1118}
.shot img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.shot:after{content:"";position:absolute;left:0;right:0;bottom:0;height:3px;background:var(--t)}
.shot .scan{position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(11,19,27,.75));}
.weapon{position:absolute;right:26px;top:290px;font:96px/1 Anton;letter-spacing:.02em;color:transparent;-webkit-text-stroke:1.2px color-mix(in srgb,var(--t) 55%,transparent);opacity:.55}
.body{position:relative;padding:22px 26px 0}
.wname{font:15px BCB;letter-spacing:.24em;color:var(--t)}
h2{font:38px/1.05 Anton;letter-spacing:.01em;margin-top:6px;text-transform:uppercase}
p.d{font-size:15.5px;line-height:1.5;color:#aeb6be;margin-top:10px;max-width:440px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:14px}
.chips span{font:13px BC;letter-spacing:.06em;padding:4px 9px;border:1px solid rgba(236,232,225,.16);background:rgba(236,232,225,.05);color:#c9cfd5}
.foot{position:absolute;left:26px;right:26px;bottom:22px;display:flex;justify-content:space-between;align-items:center;font:14px BCB;letter-spacing:.22em}
.foot .eq{color:#0b131b;background:var(--t);padding:7px 14px;clip-path:polygon(0 0,100% 0,100% 70%,calc(100% - 8px) 100%,0 100%)}
.foot .src{color:#8a96a3}
.phone{position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(circle at 50% 40%,#0f3a33,#0a1118 70%)}
.phone .scr{width:210px;height:236px;margin-top:12px;border:7px solid #1f2a35;border-bottom-width:0;border-radius:22px 22px 0 0;background:#06100d;padding:22px 14px;font:11.5px/1.55 ui-monospace,Menlo,monospace;color:#7fe7c7}
.phone p{white-space:nowrap}.phone b{color:#2ee6b6}.phone .m{color:#6f8a83}.phone .ok{color:#9ff0d6}
.cur{display:inline-block;width:7px;height:12px;background:#2ee6b6;vertical-align:-1px}
`;

function cardHtml(p) {
  const t = tiers[p.tier];
  const art = p.art === 'phone' ? phone : `<img src="file://${here}/shots/${p.img}"><div class="scan"></div>`;
  const action = p.live ? 'EQUIP  /  LIVE' : 'INSPECT  /  CODE';
  const src = p.live && p.code ? '+ SOURCE' : p.code ? 'GITHUB' : 'PRODUCTION';
  return `<div class="card" style="--t:${t.color}">
  <div class="edge"></div>
  <div class="top"><div class="slot"><b>${p.slot}</b> &nbsp;/&nbsp; ${p.sub}</div><div class="tier"><i class="gem"></i>${t.name}</div></div>
  <div class="shot">${art}</div>
  <div class="weapon">${p.weapon}</div>
  <div class="body">
    <div class="wname">${p.weapon}</div>
    <h2>${p.name}</h2>
    <p class="d">${p.desc}</p>
    <div class="chips">${p.stack.map((s) => `<span>${s}</span>`).join('')}</div>
  </div>
  <div class="foot"><span class="eq">${action}</span><span class="src">${src}</span></div>
</div>`;
}

const tmp = join(here, '.cards');
mkdirSync(tmp, { recursive: true });
mkdirSync(join(ROOT, 'assets/cards'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 520, height: 576 } });
for (const p of projects) {
  const f = join(tmp, `${p.id}.html`);
  writeFileSync(f, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${cardHtml(p)}</body></html>`);
  await page.goto('file://' + f);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const png = join(tmp, `${p.id}.png`);
  await page.locator('.card').screenshot({ path: png, omitBackground: true });
  const out = join(ROOT, 'assets/cards', `${p.id}.webp`);
  execFileSync('python3', ['-c', `from PIL import Image;Image.open(${JSON.stringify(png)}).save(${JSON.stringify(out)},quality=84,method=6)`]);
  console.log('  card', p.id);
}
await browser.close();
