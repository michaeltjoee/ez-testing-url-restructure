import { test, expect } from "@playwright/test";
import {
  BASE_URL,
  PAGE_PATHS,
  PAGE_EXPECTED_TEXT_ID,
  PAGE_EXPECTED_TEXT_EN,
} from "./constants";

const shouldValidateText = process.env.validateText === "true";

test.describe("TEST CASE: 31, 32, 33", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();

    // Set cookies before navigation
    await context.addCookies([
      {
        name: "userlang",
        value: "id",
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
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-us${path}`;
    const expectedUrl = `${BASE_URL}/id-us${path}`;
    const expectedTextID = PAGE_EXPECTED_TEXT_ID[path];
    const expectedTextEN = PAGE_EXPECTED_TEXT_EN[path];
    const expectedUrlAfterLogin = `${BASE_URL}/en-us${path}`;

    test(`should redirect ${url} to ${expectedUrl} and display IDR currency, then switch to en-us after login`, async ({
      page,
      context,
    }) => {
      await page.goto(url);

      // Should redirect to id-us locale
      await expect(page).toHaveURL(expectedUrl);

      // Expect IDR currency to be visible in the header
      await expect(page.locator("header").getByText("IDR")).toBeVisible();

      // Text validation (only when validateText=true)
      if (shouldValidateText) {
        // Expect path-specific text to be visible
        await expect(page.getByText(expectedTextID).first()).toBeVisible();
      }

      // Simulate login by changing cookies to English locale
      await context.addCookies([
        {
          name: "userlang",
          value: "en",
          domain: BASE_URL.replace("https://", ""),
          path: "/",
        },
        {
          name: "tiket_currency",
          value: "USD",
          domain: BASE_URL.replace("https://", ""),
          path: "/",
        },
      ]);

      // Refresh the page to apply new cookies
      await page.reload();

      // After login, should be on en-us locale
      await expect(page).toHaveURL(expectedUrlAfterLogin);

      // Expect USD currency to be visible in the header
      await expect(page.locator("header").getByText("USD")).toBeVisible();

      // Text validation after login (only when validateText=true)
      if (shouldValidateText) {
        // Expect English path-specific text to be visible
        await expect(page.getByText(expectedTextEN).first()).toBeVisible();
      }

      // Simulate logout by refreshing the page
      await page.reload();

      // After logout, should still be on en-us locale (cookies persist)
      await expect(page).toHaveURL(expectedUrlAfterLogin);

      // Expect USD currency to still be visible in the header
      await expect(page.locator("header").getByText("USD")).toBeVisible();

      // Text validation after logout (only when validateText=true)
      if (shouldValidateText) {
        // Expect English path-specific text to still be visible
        await expect(page.getByText(expectedTextEN).first()).toBeVisible();
      }
    });
  }
});

