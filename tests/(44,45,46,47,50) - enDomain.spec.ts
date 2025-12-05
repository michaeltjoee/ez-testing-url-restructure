import { test, expect } from '@playwright/test';
import { BASE_URL, EN_DOMAIN, PAGE_PATHS } from './constants';

const isUsingJapanVPN = process.env.isUsingJapanVPN === 'true';

test.describe('TEST CASE: 44', () => {
  for (const path of PAGE_PATHS) {
    const url = `${EN_DOMAIN}${path}`;
    const expectedUrl = isUsingJapanVPN
      ? `${BASE_URL}/en-us${path}?currency=JPY`
      : `${BASE_URL}/en-sg${path}`;
    const expectedCurrency = isUsingJapanVPN ? 'JPY' : 'SGD';

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator(`text=${expectedCurrency}`).first()).toBeVisible();
    });
  }
});

test.describe('TEST CASE: 45', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'userlang',
        value: 'id',
        domain: '.tiket.com',
        path: '/',
      },
      {
        name: 'tiket_currency',
        value: 'IDR',
        domain: '.tiket.com',
        path: '/',
      },
    ]);
  });

  for (const path of PAGE_PATHS) {
    const url = `${EN_DOMAIN}${path}`;
    const countryCode = isUsingJapanVPN ? 'us' : 'sg';
    const expectedUrl = `${BASE_URL}/id-${countryCode}${path}`;

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=IDR').first()).toBeVisible();
    });
  }
});

test.describe('TEST CASE: 46', () => {
  for (const path of PAGE_PATHS) {
    const url = `${EN_DOMAIN}/en-us${path}`;
    const expectedUrl = `${BASE_URL}/en-us${path}`;

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=USD').first()).toBeVisible();
    });
  }
});

test.describe('TEST CASE: 47', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'userlang',
        value: 'id',
        domain: '.tiket.com',
        path: '/',
      },
      {
        name: 'tiket_currency',
        value: 'IDR',
        domain: '.tiket.com',
        path: '/',
      },
    ]);
  });

  for (const path of PAGE_PATHS) {
    const url = `${EN_DOMAIN}/en-us${path}`;
    const expectedUrl = `${BASE_URL}/id-us${path}`;

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=IDR').first()).toBeVisible();
    });
  }
});


test.describe('TEST CASE: 50', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${EN_DOMAIN}${path}?currency=IDR`;
    const countryCode = isUsingJapanVPN ? 'us' : 'sg';
    const expectedUrl = `${BASE_URL}/en-${countryCode}${path}?currency=IDR`;

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=IDR').first()).toBeVisible();
    });
  }
});
