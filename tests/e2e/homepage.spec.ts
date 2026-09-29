import { expect, test } from "@playwright/test";

test("homepage loads with nav, hero, sections and footer", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Shlok Bhakta/);

  await expect(page.getByRole("link", { name: "Shlok Bhakta, home" })).toBeVisible();
  await expect(page.getByRole("link", { name: "notes", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "projects", exact: true }).first()).toBeVisible();

  await expect(page.getByRole("heading", { level: 1, name: /Shlok\s*Bhakta/ })).toBeVisible();
  await expect(page.locator("[data-binary-fluid] canvas")).toBeVisible();

  const hero = page.locator(".hero");
  for (const label of ["github", "linkedin", "resume"]) {
    await expect(hero.getByRole("link", { name: new RegExp(`^${label}`) })).toBeVisible();
  }
  await expect(hero.getByRole("link", { name: "email me" })).toHaveAttribute("href", "mailto:shlokbhakta1@gmail.com");

  // experience comes first, then hackathons, then personal projects
  const headings = await page.locator("main h2.section-title").allTextContents();
  expect(headings.map((text) => text.replace(/\d+$/, ""))).toEqual(["Experience", "Hackathons", "Projects"]);

  await expect(page.locator(".job", { hasText: "USAA" })).toBeVisible();
  await expect(page.locator(".hack.win", { hasText: "Cabin Connect" })).toContainText("winner");
  await expect(page.locator(".project", { hasText: "Homelab" })).toBeVisible();

  await expect(page.locator(".site-footer")).toBeVisible();
});

test("accent swatch changes the accent and it survives navigation", async ({ page }) => {
  await page.goto("/");
  const accent = () => page.evaluate(() => document.documentElement.dataset.accent);

  const before = await accent();
  await page.locator("[data-accent-swatch]").click();
  const after = await accent();
  expect(after).not.toBe(before);

  await page.goto("/definitely-not-a-real-page");
  expect(await accent()).toBe(after);
});

test("navbar notes link navigates to the blog page", async ({ page, request }) => {
  test.skip(!(await pocketBaseUp(request)), "PocketBase unreachable");
  await page.goto("/");
  await page.getByRole("link", { name: "notes", exact: true }).click();
  await expect(page).toHaveURL(/\/blog/);
  await expect(page).toHaveTitle(/Notes/);
});

test("navbar projects link navigates to the projects page", async ({ page, request }) => {
  // Projects need PocketBase; skip the click-through when it is down.
  test.skip(!(await pocketBaseUp(request)), "PocketBase unreachable");
  await page.goto("/");
  await page.locator(".site-nav").getByRole("link", { name: "projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects/);
  await expect(page).toHaveTitle(/Projects/);
});

async function pocketBaseUp(request: import("@playwright/test").APIRequestContext): Promise<boolean> {
  try {
    const res = await request.get("https://db.shlokbhakta.dev/api/health", {
      timeout: 10_000,
    });
    return res.ok();
  } catch {
    return false;
  }
}
