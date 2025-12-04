import { test, expect } from "@playwright/test";
import { BASE_URL, PAGE_PATHS, PAGE_EXPECTED_TEXT_EN } from "./constants";

const shouldValidateText = process.env.validateText === "true";

test.describe("TEST CASE: 34, 35, 36", () => {
  test.beforeEach(async ({ context }) => {
    // Clear all cookies - user has no initial preference
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-id${path}`;
    const expectedUrl = `${BASE_URL}/en-id${path}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should stay on ${url} with IDR currency, then maintain en-id after login`, async ({
      page,
      context,
    }) => {
      // Visit without any cookies
      await page.goto(url);

      // Should stay on en-id locale
      await expect(page).toHaveURL(expectedUrl);

      // Expect IDR currency to be visible in the header
      await expect(page.locator("header").getByText("IDR")).toBeVisible();

      // Text validation (only when validateText=true)
      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }

      // Simulate login by setting cookies
      await context.addCookies([
        {
          name: "userlang",
          value: "en",
          domain: BASE_URL.replace("https://", ""),
          path: "/",
        },
        {
          name: "tiket_currency",
          value: "IDR",
          domain: BASE_URL.replace("https://", ""),
          path: "/",
        },
      ]);

      // Refresh the page to apply login cookies
      await page.reload();

      // After login, should still be on en-id locale
      await expect(page).toHaveURL(expectedUrl);

      // Expect IDR currency to still be visible in the header
      await expect(page.locator("header").getByText("IDR")).toBeVisible();

      // Text validation after login (only when validateText=true)
      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }

      // Simulate logout by refreshing the page
      await page.reload();

      // After logout, should still be on en-id locale (cookies persist)
      await expect(page).toHaveURL(expectedUrl);

      // Expect IDR currency to still be visible in the header
      await expect(page.locator("header").getByText("IDR")).toBeVisible();

      // Text validation after logout (only when validateText=true)
      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});
