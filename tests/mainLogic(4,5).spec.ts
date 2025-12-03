import { test, expect } from "@playwright/test";
import {
  BASE_URL,
  PAGE_PATHS,
  PAGE_EXPECTED_TEXT_EN,
  LOCALE_TEXT,
} from "./constants";

const shouldValidateText = process.env.validateText === "true";

test.describe("Main Logic - en-us locale should display USD currency (TEST CASE 4)", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-us${path}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should stay on ${url} and display USD currency in header`, async ({
      page,
    }) => {
      await page.goto(url);

      // Should stay on en-us (no redirect)
      await expect(page).toHaveURL(url);

      // Expect USD currency to be visible in the header
      await expect(page.locator("header").getByText("USD")).toBeVisible();

      // Text validation (only when validateText=true)
      if (shouldValidateText) {
        // Expect English locale text to confirm active locale
        await expect(page.getByText(LOCALE_TEXT.en).first()).toBeVisible();

        // Expect path-specific text to be visible
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe("Main Logic - en-us locale with currency=IDR query param (TEST CASE 5)", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-us${path}?currency=IDR`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should stay on ${url} and display IDR currency in header`, async ({
      page,
    }) => {
      await page.goto(url);

      // Should stay on en-us with currency query param preserved
      await expect(page).toHaveURL(url);

      // Expect IDR currency to be visible in the header
      await expect(page.locator("header").getByText("IDR")).toBeVisible();

      // Text validation (only when validateText=true)
      if (shouldValidateText) {
        // Expect English locale text to confirm active locale
        await expect(page.getByText(LOCALE_TEXT.en).first()).toBeVisible();

        // Expect path-specific text to be visible
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});
