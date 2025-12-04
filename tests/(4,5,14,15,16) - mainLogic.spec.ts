import { test, expect } from "@playwright/test";
import { BASE_URL, PAGE_PATHS, PAGE_EXPECTED_TEXT_EN } from "./constants";

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
        // Expect path-specific text to be visible
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe("Main Logic - en-us locale with unknown currency=INR query param (TEST CASE 14)", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const initialUrl = `${BASE_URL}/en-us${path}?currency=INR`;
    const expectedUrl = `${BASE_URL}/en-us${path}?currency=USD`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect from ${initialUrl} to ${expectedUrl} and display USD currency in header`, async ({
      page,
    }) => {
      await page.goto(initialUrl);

      // Should redirect to same path but with currency=USD (unknown currency INR falls back to USD)
      await expect(page).toHaveURL(expectedUrl);

      // Expect USD currency to be visible in the header
      await expect(page.locator("header").getByText("USD")).toBeVisible();

      // Text validation (only when validateText=true)
      if (shouldValidateText) {
        // Expect path-specific text to be visible
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe("Main Logic - en-us locale with tiket_currency=SGD cookie (TEST CASE 15)", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-us${path}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should stay on ${url} and display SGD currency from cookie in header`, async ({
      context,
      page,
    }) => {
      // Set tiket_currency cookie to SGD before visiting the page
      await context.addCookies([
        {
          name: "tiket_currency",
          value: "SGD",
          domain: ".tiket.com",
          path: "/",
        },
      ]);

      await page.goto(url);

      // Should stay on en-us (no redirect)
      await expect(page).toHaveURL(url);

      // Expect SGD currency to be visible in the header (from cookie)
      await expect(page.locator("header").getByText("SGD")).toBeVisible();

      // Text validation (only when validateText=true)
      if (shouldValidateText) {
        // Expect path-specific text to be visible
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe("Main Logic - en-us locale with currency=IDR query param and tiket_currency=SGD cookie (TEST CASE 16)", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const initialUrl = `${BASE_URL}/en-us${path}?currency=IDR`;
    const expectedUrl = `${BASE_URL}/en-us${path}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect from ${initialUrl} to ${expectedUrl} and display SGD currency from cookie (cookie overrides query param)`, async ({
      context,
      page,
    }) => {
      // Set tiket_currency cookie to SGD before visiting the page
      await context.addCookies([
        {
          name: "tiket_currency",
          value: "SGD",
          domain: ".tiket.com",
          path: "/",
        },
      ]);

      await page.goto(initialUrl);

      // Should redirect to URL without currency query param (cookie takes precedence)
      await expect(page).toHaveURL(expectedUrl);

      // Expect SGD currency to be visible in the header (cookie overrides query param)
      await expect(page.locator("header").getByText("SGD")).toBeVisible();

      // Text validation (only when validateText=true)
      if (shouldValidateText) {
        // Expect path-specific text to be visible
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});
