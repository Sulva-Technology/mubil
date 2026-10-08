import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/about",
  "/programmes",
  "/programmes/back-to-school",
  "/events",
  "/events/community-health-day-makoko",
  "/news",
  "/news/how-40-schools-kept-children-in-class",
  "/gallery",
  "/contact",
  "/admin/login",
  "/this-page-does-not-exist",
];

test.describe("accessibility (axe, WCAG 2.1 AA)", () => {
  for (const path of pages) {
    test(path, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path, { waitUntil: "load" });
      // Third-party map iframe is out of our control.
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("iframe")
        .analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).slice(0, 5).join(" | ")}`);
      expect(summary, summary.join("\n")).toEqual([]);
    });
  }

  test("gallery lightbox", async ({ page }) => {
    await page.goto("/gallery");
    await page.getByRole("button", { name: /Open photo/ }).first().click();
    await page.getByRole("dialog", { name: "Photo viewer" }).waitFor();
    const results = await new AxeBuilder({ page }).include("[role=dialog]").analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("team bio modal", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: /Read bio/ }).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    const results = await new AxeBuilder({ page }).include("[role=dialog]").analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });
});
