import { test, expect } from "@playwright/test";
import { BASE_URL, PAGE_PATHS } from "./constants";

test.describe("Case-insensitive locale redirect", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/EN-US${path}`;
    const expectedUrl = `${BASE_URL}/en-us${path}`;

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator("header").getByText("USD")).toBeVisible();
    });
  }

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/ID-ID${path}`;
    const expectedUrl = `${BASE_URL}/id-id${path}`;

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator("header").getByText("IDR")).toBeVisible();
    });
  }
});

