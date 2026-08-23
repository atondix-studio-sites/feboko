import { test, expect } from "@playwright/test";

const routes = ["/", "/services", "/team", "/karriere", "/blog", "/impressum"];

for (const route of routes) {
  test(`page loads DE: ${route}`, async ({ page }) => {
    await page.goto(`http://localhost:3000${route}`);
    await expect(page.locator("header.site-header")).toBeVisible();
  });

  test(`page loads EN: ${route}`, async ({ page }) => {
    await page.goto(`http://localhost:3000${route}?lang=en`);
    await expect(page.locator("header.site-header")).toBeVisible();
  });
}
