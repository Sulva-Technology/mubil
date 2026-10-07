import { expect, test } from "@playwright/test";

/**
 * Full publishing flow: log in, create an event, publish it, see it on
 * /events, unpublish it, see it disappear, then delete it.
 *
 * Needs an admin account (in the admins table):
 *   E2E_ADMIN_EMAIL=... E2E_ADMIN_PASSWORD=... npm run test:e2e
 */
const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test.describe("admin publishing flow", () => {
  test.skip(!email || !password, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run");
  test.skip(({ isMobile }) => isMobile, "Desktop only");

  test("create, publish, unpublish and delete an event", async ({ page }) => {
    const title = `E2E check ${Date.now()}`;

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    // Dismiss the first-login tour if it appears.
    const tourClose = page.locator(".driver-popover-close-btn");
    if (await tourClose.isVisible({ timeout: 3000 }).catch(() => false)) await tourClose.click();

    await page.goto("/admin/events?new=1");
    const panel = page.getByRole("dialog", { name: "New event" });
    await panel.getByLabel("Title").fill(title);
    const nextMonth = new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10);
    await panel.getByLabel("Date").fill(nextMonth);
    await panel.getByLabel("Venue").fill("Playwright Hall");
    await panel.getByRole("radio", { name: "Published" }).click();
    await page.getByRole("button", { name: "Save and publish" }).click();
    await expect(page.getByText("Event published").first()).toBeVisible();
    await page.getByRole("button", { name: "Close", exact: true }).click();

    // Public site picks it up (revalidatePath runs on save).
    await expect(async () => {
      await page.goto("/events");
      await expect(page.getByText(title)).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 30_000 });

    // Unpublish from the list.
    await page.goto(`/admin/events?q=${encodeURIComponent(title)}`);
    await page.getByRole("button", { name: `Unpublish ${title}` }).click();
    await expect(page.getByText("Event moved to drafts").first()).toBeVisible();

    await expect(async () => {
      await page.goto("/events");
      await expect(page.getByText(title)).toHaveCount(0, { timeout: 2000 });
    }).toPass({ timeout: 30_000 });

    // Clean up.
    await page.goto(`/admin/events?q=${encodeURIComponent(title)}`);
    await page.getByRole("button", { name: `Delete ${title}` }).click();
    await page.getByRole("button", { name: "Delete event" }).click();
    await expect(page.getByText("Event deleted").first()).toBeVisible();
  });
});

test.describe("admin guard", () => {
  test("redirects signed-out visitors to the login page", async ({ page }) => {
    await page.goto("/admin/events");
    await expect(page).toHaveURL(/\/admin\/login\?next=%2Fadmin%2Fevents/);
    await expect(page.getByRole("heading", { name: "Sign in to manage the site" })).toBeVisible();
  });
});
