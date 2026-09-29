import { expect, test } from "@playwright/test";

test("unknown route renders the 404 page", async ({ page }) => {
  const res = await page.goto("/definitely-not-a-real-page");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: /404/ })).toBeVisible();
  await expect(page.getByText("no such file or directory")).toBeVisible();
  await expect(page.getByRole("link", { name: /back home/ })).toHaveAttribute("href", "/");
});

test("API route /api/mdtohtml answers with JSON", async ({ request }) => {
  const res = await request.get("/api/mdtohtml?phonenum=123");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/json");
  expect(await res.json()).toBe("yabadoo");
});

test("middleware redirects /contact/ to /index.html", async ({
  request,
}) => {
  const res = await request.get("/contact/", { maxRedirects: 0 });
  expect([301, 302, 307, 308]).toContain(res.status());
  expect(res.headers()["location"]).toBe("/index.html");
});

test("middleware adds COOP/COEP headers for the game page", async ({
  request,
}) => {
  const res = await request.get("/games/spreadthelight/spreadthelight");
  expect(res.status()).toBe(200);
  expect(res.headers()["cross-origin-opener-policy"]).toBe("same-origin");
  expect(res.headers()["cross-origin-embedder-policy"]).toBe("require-corp");
});

test("static assets are served", async ({ request }) => {
  const favicon = await request.get("/favicon.svg");
  expect(favicon.status()).toBe(200);

  const resume = await request.head("/resume.pdf");
  expect(resume.status()).toBe(200);
});

test("blog editor page loads its shell", async ({ page }) => {
  await page.goto("/blogeditor");
  await expect(page).toHaveTitle(/Editor/);
  await expect(
    page.getByRole("link", { name: "Shlok Bhakta, home" }),
  ).toBeVisible();
});
