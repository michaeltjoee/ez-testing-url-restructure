import { test, expect } from '@playwright/test';
import { BASE_URL, PAGE_PATHS, PAGE_EXPECTED_TEXT_EN } from './constants';

const shouldValidateText = process.env.validateText === "true";
const isUsingJapanVPN = process.env.isUsingJapanVPN === "true";

// When Japan VPN is active, redirects go to en-us with JPY currency
const expectedLocale = isUsingJapanVPN ? "en-us" : "en-sg";
const expectedCurrency = isUsingJapanVPN ? "JPY" : "SGD";

test.describe('Entered url has non-targetted country and language without currency param and no user preference (TEST CASE 6)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-in${path}`;
    const currencyParam = isUsingJapanVPN ? "?currency=JPY" : "";
    const expectedUrl = `${BASE_URL}/${expectedLocale}${path}${currencyParam}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect ${url} to ${expectedUrl} and display ${expectedCurrency} currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('header').getByText(expectedCurrency)).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe('Entered url has non-targetted country and language without currency param and no user preference (TEST CASE 7, 8)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-ch${path}`;
    const currencyParam = isUsingJapanVPN ? "?currency=JPY" : "";
    const expectedUrl = `${BASE_URL}/${expectedLocale}${path}${currencyParam}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect ${url} to ${expectedUrl} and display ${expectedCurrency} currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('header').getByText(expectedCurrency)).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});


test.describe('User with Chinese locale visiting hi-in with INR currency (TEST CASE 9)', () => {
  // Simulate user with Chinese browser locale
  test.use({
    locale: 'zh-CN',
  });

  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/hi-in${path}?currency=INR`;
    const expectedUrl = `${BASE_URL}/${expectedLocale}${path}?currency=${expectedCurrency}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect ${url} to ${expectedUrl} and display ${expectedCurrency} in header`, async ({ page }) => {
      await page.goto(url);

      // Expect redirect to expected locale with expected currency
      await expect(page).toHaveURL(expectedUrl);

      // Expect currency to be visible in the header
      await expect(page.locator('header').getByText(expectedCurrency)).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe('User visiting en-in with SGD currency query param (TEST CASE 10)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-in${path}?currency=SGD`;
    // When Japan VPN is active, query param is removed and redirects to en-us
    const expectedUrl = isUsingJapanVPN
      ? `${BASE_URL}/en-us${path}?currency=SGD`
      : `${BASE_URL}/en-sg${path}?currency=SGD`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect ${url} to ${expectedUrl} and display SGD in header`, async ({ page }) => {
      await page.goto(url);

      // Expect redirect to expected locale
      await expect(page).toHaveURL(expectedUrl);

      // Expect SGD currency to be visible in the header (currency param preserved)
      await expect(page.locator('header').getByText('SGD')).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

