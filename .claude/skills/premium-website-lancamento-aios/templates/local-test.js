/**
 * QA — render landing page at 3 breakpoints to PNG.
 * Requires Playwright + local server running on http://localhost:8000
 *
 * Run from site/lancamento-<slug>/ folder:
 *   NODE_PATH="<...>/playwright/node_modules" node local-test.js
 */
const { chromium } = require('playwright');
const path = require('path');

const URL = process.env.URL || 'http://localhost:8000/';

(async () => {
  const browser = await chromium.launch();

  const breakpoints = [
    { name: 'desktop', w: 1440, h: 900  },
    { name: 'tablet',  w: 768,  h: 1024 },
    { name: 'mobile',  w: 390,  h: 844  },
  ];

  for (const b of breakpoints) {
    const ctx = await browser.newContext({
      viewport: { width: b.w, height: b.h },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 20000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);

    // Force-reveal scroll-animated sections so screenshot captures them
    await page.evaluate(() => {
      document.querySelectorAll('.section, .bento-cell, .signature-card, .amenity-col, .stat')
        .forEach(el => el.classList.add('is-visible'));
    });
    await page.waitForTimeout(200);

    const out = path.join(__dirname, `.qa-${b.name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`✓ ${b.name.padEnd(8)} ${b.w}x${b.h}  →  ${out}`);

    await ctx.close();
  }

  await browser.close();
  console.log('\nDelete .qa-*.png when done.');
})();
