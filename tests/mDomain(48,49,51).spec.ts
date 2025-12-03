import { test, expect } from '@playwright/test';
import { BASE_URL, M_DOMAIN, PAGE_PATHS } from './constants';

test.describe('M Domain Redirection (legacy domain) without cookies (TEST CASE 48)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${M_DOMAIN}${path}`;
    const expectedUrl = `${BASE_URL}/en-sg${path}`;

    test(`should redirect ${url} to ${expectedUrl} and display SGD currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=SGD').first()).toBeVisible();
    });
  }
});

test.describe('M Domain Redirection with /en-us path (TEST CASE 49)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${M_DOMAIN}/en-us${path}`;
    const expectedUrl = `${BASE_URL}/en-us${path}`;

    test(`should redirect ${url} to ${expectedUrl} and display USD currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=USD').first()).toBeVisible();
    });
  }
});

test.describe('M Domain Redirection with currency query param (TEST CASE 51)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${M_DOMAIN}${path}?currency=IDR`;
    const expectedUrl = `${BASE_URL}/en-sg${path}?currency=IDR`;

    test(`should redirect ${url} to ${expectedUrl} and display IDR currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=IDR').first()).toBeVisible();
    });
  }
});

