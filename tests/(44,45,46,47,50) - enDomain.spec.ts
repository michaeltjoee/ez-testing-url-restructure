import { test, expect } from '@playwright/test';
import { BASE_URL, EN_DOMAIN, PAGE_PATHS } from './constants';

test.describe('EN Domain Redirection (TEST CASE 44)', () => {
  for (const path of PAGE_PATHS) {
    const url = `${EN_DOMAIN}${path}`;
    const expectedUrl = `${BASE_URL}/en-sg${path}`;

    test(`should redirect ${url} to ${expectedUrl} and display SGD currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=SGD').first()).toBeVisible();
    });
  }
});

test.describe('EN Domain Redirection with userlang and currency cookie (TEST CASE 45)', () => {
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
    const expectedUrl = `${BASE_URL}/id-sg${path}`;

    test(`should redirect ${url} to ${expectedUrl} and display IDR currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=IDR').first()).toBeVisible();
    });
  }
});

test.describe('EN Domain Redirection maintaining en-us locale-country (TEST CASE 46)', () => {
  for (const path of PAGE_PATHS) {
    const url = `${EN_DOMAIN}/en-us${path}`;
    const expectedUrl = `${BASE_URL}/en-us${path}`;

    test(`should redirect ${url} to ${expectedUrl} and display USD currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=USD').first()).toBeVisible();
    });
  }
});

test.describe('EN Domain Redirection maintaining en-us locale-country, with userlang and currency cookie (TEST CASE 47)', () => {
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

    test(`should redirect ${url} to ${expectedUrl} and display IDR currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=IDR').first()).toBeVisible();
    });
  }
});


test.describe('EN Domain shows IDR when currency query param is set and no currency cookie (TEST CASE 50)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${EN_DOMAIN}${path}?currency=IDR`;
    const expectedUrl = `${BASE_URL}/en-sg${path}?currency=IDR`;

    test(`should redirect ${url} to ${expectedUrl} and display IDR currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=IDR').first()).toBeVisible();
    });
  }
});
