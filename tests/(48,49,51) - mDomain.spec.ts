import { test, expect } from '@playwright/test';
import { BASE_URL, M_DOMAIN, PAGE_PATHS, env, PRODUCTION_EXPECTED_COUNTRY_CODE, PRODUCTION_EXPECTED_CURRENCY } from './constants';

const isUsingJapanVPN = process.env.isUsingJapanVPN === 'true';

// TODO: DOUBLE CHECK ON PRODUCTION (MAY FALSE POSITIVE)
test.describe('TEST CASE: 48', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${M_DOMAIN}${path}`;
    const expectedUrl = env === 'production'
      ? `${BASE_URL}/en-${PRODUCTION_EXPECTED_COUNTRY_CODE}${path}`
      : isUsingJapanVPN
        ? `${BASE_URL}/en-us${path}?currency=JPY`
        : `${BASE_URL}/en-sg${path}`;
    const expectedCurrency = env === 'production'
      ? PRODUCTION_EXPECTED_CURRENCY
      : isUsingJapanVPN ? 'JPY' : 'SGD';

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator(`text=${expectedCurrency}`).first()).toBeVisible();
    });
  }
});

test.describe('TEST CASE: 49', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${M_DOMAIN}/en-us${path}`;
    const expectedUrl = `${BASE_URL}/en-us${path}`;

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=USD').first()).toBeVisible();
    });
  }
});

test.describe('TEST CASE: 51', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${M_DOMAIN}${path}?currency=IDR`;
    const countryCode =
      env === 'production'
        ? PRODUCTION_EXPECTED_COUNTRY_CODE
        : isUsingJapanVPN
          ? 'us'
          : 'sg';
    const expectedUrl = `${BASE_URL}/en-${countryCode}${path}?currency=IDR`;

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=IDR').first()).toBeVisible();
    });
  }
});

