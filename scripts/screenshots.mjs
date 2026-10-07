// Usage: node scripts/screenshots.mjs [baseUrl] [route ...]
// Saves full-page screenshots at 360px and 1280px into ./screenshots
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const routes = process.argv.slice(3).length ? process.argv.slice(3) : ["/styleguide"];
const widths = [360, 1280];

await mkdir("screenshots", { recursive: true });
const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 800 }, reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    // Scroll through so lazy images and in-view reveals load before capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) console.warn(`${route} @${width}: horizontal overflow ${overflow}px`);
    await page.screenshot({ path: `screenshots/${name}-${width}.png`, fullPage: true });
    console.log(`saved ${name}-${width}.png`);
  }
  await page.close();
}
await browser.close();
