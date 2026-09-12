import { expect, test } from "@playwright/test";

test("homepage loads with nav, hero and footer", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Home Page/);

  // Navbar (server-rendered)
  await expect(page.getByRole("link", { name: "SB~@" })).toBeVisible();
  await expect(page.getByRole("link", { name: "./blog" }).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "./projects" }).first(),
  ).toBeVisible();

  // Hero section (client-hydrated)
  await expect(page.getByText("Shlok_Bhakta")).toBeVisible();
  await expect(
    page.getByText("Texas A&M University (2026)"),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "See Resume" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "GitHub", exact: true }),
  ).toBeVisible();

  // Footer (client-hydrated)
  await expect(page.getByText("Thanks for Reading!")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Check out my blog" }),
  ).toBeVisible();
});

test("navbar ./blog link navigates to the blog page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "./blog" }).first().click();
  await expect(page).toHaveURL(/\/blog/);
  await expect(page).toHaveTitle(/Blog/);
});

test("navbar ./projects link navigates to the projects page", async ({
  page,
  request,
}) => {
  // Projects need PocketBase; skip the click-through when it is down.
  test.skip(!(await pocketBaseUp(request)), "PocketBase unreachable");
  await page.goto("/");
  await page.getByRole("link", { name: "./projects" }).first().click();
  await expect(page).toHaveURL(/\/projects/);
  await expect(page).toHaveTitle(/My Projects/);
});

async function pocketBaseUp(
  request: import("@playwright/test").APIRequestContext,
): Promise<boolean> {
  try {
    const res = await request.get("https://db.shlokbhakta.dev/api/health", {
      timeout: 10_000,
    });
    return res.ok();
  } catch {
    return false;
  }
}
