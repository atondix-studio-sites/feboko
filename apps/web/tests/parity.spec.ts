import { test, expect } from "@playwright/test";

const routes = ["/", "/services", "/team", "/karriere", "/blog", "/impressum"];

for (const route of routes) {
  test(`page loads DE: ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("header.site-header")).toBeVisible();
  });

  test(`page loads EN: ${route}`, async ({ page }) => {
    await page.goto(`${route}?lang=en`);
    await expect(page.locator("header.site-header")).toBeVisible();
  });
}

test("mobile homepage preserves production header, hero, and drawer behavior", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.locator(".site-header")).toHaveCSS("height", "46.6875px");
  await expect(page.locator(".hero-section")).toHaveCSS("height", "500px");

  await page.locator(".hamburger-toggle").click();
  await expect(page.locator(".nav-container")).toHaveClass(/active/);
  await expect(page.locator(".nav-container > .language-switcher")).toBeVisible();
});

test("desktop mega-menu closes after selecting a service link", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const trigger = page.locator(".mega-menu-trigger-link");
  const panel = page.locator("#mega-menu-panel");
  await trigger.hover();
  await expect(panel).toBeVisible();

  await panel.locator(".mega-menu-subservice-list.is-visible .mega-menu-links a").first().click();
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(panel).toBeHidden();
});

test("mobile mega-menu closes its accordion and navigation drawer after selection", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.waitForFunction(
    () => document.querySelector<HTMLElement>(".menu-item-has-mega-menu")?.dataset.megaMenuInitialized === "true",
  );

  await page.locator(".hamburger-toggle").click();
  await expect(page.locator(".nav-container")).toHaveClass(/active/);
  await page.locator(".mega-menu-toggle").click();
  await page.locator(".mega-menu-category").first().click();
  await page.locator(".mega-menu-category-mobile-sub a").first().click();

  await expect(page.locator(".nav-container")).not.toHaveClass(/active/);
  await expect(page.locator("#mega-menu-panel")).toHaveAttribute("aria-hidden", "true");
  await expect(page.locator(".mega-menu-toggle")).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveClass(/menu-open/);
});

test("homepage carousel exposes production endpoint states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");

  const previous = page.locator("#service-carousel-prev");
  const next = page.locator("#service-carousel-next");
  await expect(previous).toHaveClass(/service-carousel-arrow--disabled/);

  for (let i = 0; i < 7; i++) await next.click({ force: true });
  await expect(next).toHaveClass(/service-carousel-arrow--disabled/);
});

test("contact form matches the production field and consent flow", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[name="your-first-name"]')).toHaveAttribute("placeholder", "Vorname eingeben");
  await expect(page.locator('[name="your-last-name"]')).toHaveAttribute("placeholder", "Nachname eingeben");
  await expect(page.locator('[name="your-subject"]')).toHaveAttribute("placeholder", "Betreff eingeben");
  await expect(page.locator('[name="your-message"]')).toHaveAttribute("rows", "10");

  const submit = page.locator(".wpcf7-submit");
  await expect(submit).toBeDisabled();
  await page.locator('[name="acceptance-969"]').check();
  await expect(submit).toBeEnabled();

  await page.goto("/?lang=en");
  await expect(page.locator('form[aria-label="Contact form"] a[href="/datenschutz?lang=en"]')).toHaveAttribute(
    "href",
    "/datenschutz?lang=en",
  );
});

test("footer keeps the production consultation and contact data", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer.site-footer");
  await expect(footer).toContainText("Netzwerk aus ausgewählten Partnern");
  await expect(footer).toContainText("info@feboko.com");
  await expect(footer).toContainText("+49 (0) 157 33717052");
});

test("production blog permalinks and 404 copy are preserved", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator(".blog-grid-card").first().locator("a.read-more")).toHaveAttribute(
    "href",
    "/wettbewerbsanalyse_regulierungsanalyse",
  );

  await page.goto("/wettbewerbsanalyse_regulierungsanalyse");
  await expect(page.locator("h1.page-title")).toContainText("Wettbewerbs- und Regulierungsanalyse");

  await page.goto("/this-page-does-not-exist-audit");
  await expect(page.locator("h1.page-title")).toHaveText("Hoppla – Seite nicht gefunden");
});
