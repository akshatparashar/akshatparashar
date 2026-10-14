// Builds assets/stats.svg from live GitHub data. Run by .github/workflows/live.yml every 6 hours.
// Needs GITHUB_TOKEN in the environment. `node live.mjs --sample` renders with sample data for previews.
import { T, measure, svg, save, frame, header, tag, C, reportMissing } from './lib.mjs';

const USER = process.env.PROFILE_USER || 'akshatparashar';
const TOKEN = process.env.GITHUB_TOKEN;
const SAMPLE = process.argv.includes('--sample');
const W = 1000;

async function gh(path, init = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': USER, ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), ...init.headers },
  });
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

async function collect() {
  if (SAMPLE) return {
    contributions: 612, repos: 21, stars: 9, followers: 14,
    langs: [['JavaScript', 52.1], ['HTML', 18.4], ['CSS', 14.9], ['Python', 9.7], ['TypeScript', 4.9]],
    feed: [['PUSHED 4 COMMITS', 'PROTFOLIO', '2H'], ['CREATED REPO', 'praple_props', '1D'], ['PUSHED 2 COMMITS', 'akshatparashar', '3D'], ['STARRED', 'taste-skill', '5D'], ['PUSHED 1 COMMIT', 'Rubik-s-Cube', '3W']],
  };
  const out = { contributions: null, repos: null, stars: null, followers: null, langs: [], feed: [] };
  const step = async (name, fn) => { try { await fn(); } catch (e) { console.warn(`  ${name} skipped: ${e.message}`); } };

  await step('user', async () => {
    const u = await gh(`/users/${USER}`);
    out.repos = u.public_repos; out.followers = u.followers;
  });
  await step('repos', async () => {
    const repos = (await gh(`/users/${USER}/repos?per_page=100&type=owner&sort=pushed`)).filter((r) => !r.fork);
    out.stars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const bytes = {};
    for (const r of repos.slice(0, 40)) {
      try { for (const [k, v] of Object.entries(await gh(`/repos/${r.full_name}/languages`))) bytes[k] = (bytes[k] || 0) + v; } catch {}
    }
    const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
    out.langs = Object.entries(bytes).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => [k, (v / total) * 100]);
  });
  await step('contributions', async () => {
    const q = { query: `query($l:String!){user(login:$l){contributionsCollection{contributionCalendar{totalContributions}}}}`, variables: { l: USER } };
    const j = await gh('/graphql', { method: 'POST', body: JSON.stringify(q), headers: { 'Content-Type': 'application/json' } });
    out.contributions = j.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? null;
  });
  await step('events', async () => {
    const ev = await gh(`/users/${USER}/events/public?per_page=60`);
    const seen = new Set();
    for (const e of ev) {
      const verb = describe(e);
      if (!verb) continue;
      const repo = e.repo.name.startsWith(USER + '/') ? e.repo.name.slice(USER.length + 1) : e.repo.name.split('/')[1];
      const key = verb + repo;
      if (seen.has(key)) continue;
      seen.add(key);
      out.feed.push([verb, repo, ago(e.created_at)]);
      if (out.feed.length === 5) break;
    }
  });
  return out;
}

function describe(e) {
  const p = e.payload || {};
  switch (e.type) {
    case 'PushEvent': { const n = p.size ?? p.distinct_size ?? p.commits?.length; return n ? `PUSHED ${n} COMMIT${n > 1 ? 'S' : ''}` : 'PUSHED CODE'; }
    case 'CreateEvent': return p.ref_type === 'repository' ? 'CREATED REPO' : p.ref_type === 'tag' ? 'TAGGED A RELEASE' : 'NEW BRANCH';
    case 'WatchEvent': return 'STARRED';
    case 'ForkEvent': return 'FORKED';
    case 'PullRequestEvent': return p.action === 'closed' && p.pull_request?.merged ? 'MERGED A PR' : `${(p.action || 'opened').toUpperCase()} A PR`;
    case 'IssuesEvent': return `${(p.action || 'opened').toUpperCase()} AN ISSUE`;
    case 'ReleaseEvent': return 'SHIPPED A RELEASE';
    case 'PublicEvent': return 'WENT PUBLIC';
    case 'IssueCommentEvent': return 'COMMENTED';
    default: return null;
  }
}

function ago(iso) {
  const m = (Date.now() - new Date(iso)) / 60000;
  if (m < 60) return `${Math.max(1, Math.round(m))}M`;
  if (m < 1440) return `${Math.round(m / 60)}H`;
  if (m < 10080) return `${Math.round(m / 1440)}D`;
  return `${Math.round(m / 10080)}W`;
}

const fmt = (n) => (n == null ? '--' : n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : String(n));
const clip = (s, max, o) => { let t = s; while (measure(t, o) > max && t.length > 3) t = t.slice(0, -2); return t === s ? s : t.replace(/.$/, '') + '...'; };

function render(d) {
  const top = 162, H = 452;
  const now = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
    .format(new Date()).toUpperCase().replace(',', '  ·');

  // tiles
  const tiles = [[fmt(d.contributions), 'CONTRIBUTIONS', 'LAST 12 MONTHS', C.teal], [fmt(d.repos), 'PUBLIC REPOS', 'IN THE ARMORY', C.bone], [fmt(d.stars), 'STARS EARNED', 'ACROSS ORIGINALS', C.gold2], [fmt(d.followers), 'FOLLOWERS', 'IN THE PARTY', C.red]];
  let a = '';
  tiles.forEach(([v, l, s, col], i) => {
    const x = 48 + (i % 2) * 182, y = top + Math.floor(i / 2) * 122;
    a += `<g class="in" style="animation-delay:${(0.1 + i * 0.08).toFixed(2)}s">${tag(x, y, 170, 110, 'rgba(236,232,225,.04)', 12, `stroke="${C.line}"`)}
      <rect x="${x}" y="${y}" width="3" height="110" fill="${col}"/>
      ${T(v, { x: x + 18, y: y + 58, font: 'display', size: 42, fill: col === C.bone ? C.bone : col, ls: 1 })}
      ${T(l, { x: x + 18, y: y + 82, font: 'condB', size: 13.5, fill: C.bone, ls: 2 })}
      ${T(s, { x: x + 18, y: y + 99, font: 'cond', size: 12, fill: C.dim, ls: 1.5 })}</g>`;
  });

  // pick rate
  const bx = 432, bw = 244, palette = ['#ff5a5f', '#35d0ba', '#c77dff', '#8be04e', '#ffc857'];
  let b = T('PICK RATE', { x: bx, y: top + 14, font: 'condB', size: 14, fill: C.red, ls: 3 }) + T('LANGUAGES BY CODE', { x: bx + bw, y: top + 14, font: 'cond', size: 12, fill: C.dim, ls: 1.5, anchor: 'end' });
  (d.langs.length ? d.langs : [['Syncing', 0]]).forEach(([n, pct], i) => {
    const y = top + 46 + i * 44;
    b += T(n.toUpperCase(), { x: bx, y, font: 'condB', size: 15, fill: C.bone, ls: 1.5 });
    b += T(`${pct.toFixed(1)}%`, { x: bx + bw, y, font: 'cond', size: 14, fill: C.muted, ls: 1, anchor: 'end' });
    b += `<rect x="${bx}" y="${y + 9}" width="${bw}" height="6" fill="rgba(236,232,225,.08)"/>`;
    b += `<rect class="bar" style="animation-delay:${(0.3 + i * 0.1).toFixed(2)}s" x="${bx}" y="${y + 9}" width="${Math.max(3, (bw * pct) / 100).toFixed(1)}" height="6" fill="${palette[i]}"/>`;
  });

  // kill feed
  const fx = 708, fw = W - 48 - fx;
  let f = T('KILL FEED', { x: fx, y: top + 14, font: 'condB', size: 14, fill: C.red, ls: 3 }) + T('PUBLIC ACTIVITY', { x: fx + fw, y: top + 14, font: 'cond', size: 12, fill: C.dim, ls: 1.5, anchor: 'end' });
  const feed = d.feed.length ? d.feed : [['NO PUBLIC ACTIVITY YET', '', '']];
  feed.forEach(([verb, repo, t], i) => {
    const y = top + 30 + i * 46;
    f += `<g class="in" style="animation-delay:${(0.35 + i * 0.09).toFixed(2)}s">
      <rect x="${fx}" y="${y}" width="${fw}" height="40" fill="${i === 0 ? 'rgba(255,70,85,.12)' : 'rgba(236,232,225,.035)'}"/>
      <rect x="${fx}" y="${y}" width="3" height="40" fill="${i === 0 ? C.red : C.navy3}"/>
      ${T(verb, { x: fx + 12, y: y + 16, font: 'condB', size: 11.5, fill: i === 0 ? C.red : C.teal, ls: 1.5 })}
      ${T(clip(repo, fw - 70, { font: 'condB', size: 16, ls: .5 }), { x: fx + 12, y: y + 34, font: 'condB', size: 16, fill: C.bone, ls: .5 })}
      ${T(t, { x: fx + fw - 10, y: y + 34, font: 'cond', size: 13, fill: C.dim, ls: 1, anchor: 'end' })}</g>`;
  });

  const body = frame(W, H, header({ idx: '05', kicker: 'LIVE', title: 'SERVICE RECORD', right: `SYNCED ${now} IST` }) + a + b + f +
    `<circle class="pulse" cx="${W - 48 - measure(`SYNCED ${now} IST`, { font: 'cond', size: 14, ls: 2 }) - 12}" cy="57" r="4" fill="${C.green}"/>` +
    T('UPDATES ITSELF EVERY 6 HOURS FROM THE GITHUB API', { x: 48, y: H - 30, font: 'cond', size: 12.5, fill: C.dim, ls: 2 }));
  const style = `
  .in{opacity:0;animation:in .6s cubic-bezier(.2,.8,.2,1) forwards}
  @keyframes in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  .bar{transform-box:fill-box;transform-origin:left;animation:bar 1s cubic-bezier(.2,.8,.2,1) backwards}
  @keyframes bar{from{transform:scaleX(0)}}
  .pulse{animation:pulse 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes pulse{50%{opacity:.3;transform:scale(.6)}}`;
  return svg(W, H, body, { title: `Live GitHub stats for ${USER}: ${fmt(d.contributions)} contributions in the last year, ${fmt(d.repos)} public repos, ${fmt(d.stars)} stars, ${fmt(d.followers)} followers`, style });
}

const data = await collect();
console.log(JSON.stringify({ ...data, feed: data.feed.length, langs: data.langs.length }));
save('assets/stats.svg', render(data));
reportMissing();
