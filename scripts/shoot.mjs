// Local preview helper: screenshots SVGs (after their intro animations) or the README mock.
// usage: node shoot.mjs <out-dir> <file.svg|page.html> [...]
import { chromium } from 'playwright';
import { resolve, basename } from 'node:path';
const [out, ...files] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const f of files) {
  const abs = resolve(f);
  if (f.endsWith('.svg')) {
    const { writeFileSync } = await import('node:fs');
    const wrap = `${out}/_wrap.html`;
    writeFileSync(wrap, `<html><body style="margin:0;background:#fff"><img id="i" src="file://${abs}"></body></html>`);
    await page.goto('file://' + resolve(wrap));
    await page.waitForTimeout(4500);
    await page.locator('#i').screenshot({ path: `${out}/${basename(f)}.png` });
  } else {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('file://' + abs);
    await page.waitForTimeout(4500);
    await page.screenshot({ path: `${out}/${basename(f)}.png`, fullPage: true });
  }
}
await browser.close();
