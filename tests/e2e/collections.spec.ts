import {
  expect,
  test,
  type APIRequestContext,
} from "@playwright/test";

/**
 * The blog and projects pages are server-rendered from PocketBase at request
 * time. These specs run against the real backend when it is reachable and
 * skip otherwise, so CI stays green without production access.
 */
async function pocketBaseUp(request: APIRequestContext): Promise<boolean> {
  try {
    const res = await request.get("https://db.shlokbhakta.dev/api/health", {
      timeout: 10_000,
    });
    return res.ok();
  } catch {
    return false;
  }
}

test("blog page lists posts from PocketBase", async ({ page, request }) => {
  test.skip(!(await pocketBaseUp(request)), "PocketBase unreachable");

  await page.goto("/blog");
  await expect(page).toHaveTitle(/Blog/);
  await expect(page.getByText("Blog").first()).toBeVisible();

  const cards = page.locator('a[href^="/post/"]');
  await expect(cards.first()).toBeVisible({ timeout: 30_000 });
  expect(await cards.count()).toBeGreaterThan(0);
});

test("projects page lists projects from PocketBase", async ({
  page,
  request,
}) => {
  test.skip(!(await pocketBaseUp(request)), "PocketBase unreachable");

  await page.goto("/projects");
  await expect(page).toHaveTitle(/My Projects/);
  await expect(page.getByText("Things I Made!").first()).toBeVisible();

  const cards = page.locator('a[href^="/project/"]');
  await expect(cards.first()).toBeVisible({ timeout: 30_000 });
  expect(await cards.count()).toBeGreaterThan(0);
});
