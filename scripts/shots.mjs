// Screenshot the landing page at mobile + desktop for visual review.
// Run: node scripts/shots.mjs   (dev server must be on :3000)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const URL = 'http://localhost:3000/';
const outDir = path.join(process.cwd(), 'scratch', 'shots');
mkdirSync(outDir, { recursive: true });

const viewports = [
  { name: 'mobile', width: 375, height: 812, dsf: 2 },
  { name: 'desktop', width: 1440, height: 900, dsf: 1 },
];
const sections = ['hero', 'how', 'why', 'demo', 'output', 'pricing', 'faq'];

const browser = await chromium.launch();
try {
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dsf,
      reducedMotion: 'reduce', // freeze animations; hero shows the finished estimate
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(800);

    for (const id of sections) {
      const el = page.locator(`#${id}`);
      try {
        await el.scrollIntoViewIfNeeded({ timeout: 5000 });
        await page.waitForTimeout(150);
        await el.screenshot({ path: path.join(outDir, `${vp.name}-${id}.png`) });
        console.log(`✓ ${vp.name}-${id}.png`);
      } catch (e) {
        console.log(`! ${vp.name}-${id}: ${e.message.split('\n')[0]}`);
      }
    }
    await page.screenshot({ path: path.join(outDir, `${vp.name}-full.png`), fullPage: true });
    console.log(`✓ ${vp.name}-full.png`);
    await ctx.close();
  }
} finally {
  await browser.close();
}
console.log(`\nSaved to ${outDir}`);
