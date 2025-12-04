import { test, expect } from '@playwright/test';
import { BASE_URL, PAGE_PATHS, PAGE_EXPECTED_TEXT_ID, PAGE_EXPECTED_TEXT_EN } from './constants';

const shouldValidateText = process.env.validateText === "true";

test.describe('TEST CASE: 11', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test.use({
    locale: 'id-ID',
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/ab-us${path}`;
    const expectedUrl = `${BASE_URL}/id-us${path}`;
    const expectedText = PAGE_EXPECTED_TEXT_ID[path];

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('header').getByText('USD')).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe('TEST CASE: 12', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test.use({
    locale: 'id-ID',
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/ab-id${path}`;
    const expectedUrl = `${BASE_URL}/id-id${path}`;
    const expectedText = PAGE_EXPECTED_TEXT_ID[path];

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('header').getByText('IDR')).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe('TEST CASE: 13', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/ab-id${path}?currency=SGD`;
    const expectedUrl = `${BASE_URL}/en-id${path}?currency=SGD`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('header').getByText('SGD')).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe('TEST CASE: 20', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'userlang',
        value: 'en',
        domain: '.tiket.com',
        path: '/',
      },
      {
        name: 'tiket_currency',
        value: 'USD',
        domain: '.tiket.com',
        path: '/',
      },
    ]);
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/ab-us${path}`;
    const expectedUrl = `${BASE_URL}/en-us${path}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('header').getByText('USD')).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe('TEST CASE: 21', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'userlang',
        value: 'en',
        domain: '.tiket.com',
        path: '/',
      },
      {
        name: 'tiket_currency',
        value: 'USD',
        domain: '.tiket.com',
        path: '/',
      },
    ]);
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/ab-id${path}`;
    const expectedUrl = `${BASE_URL}/en-id${path}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('header').getByText('USD')).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

test.describe('TEST CASE: 22', () => {
  test.beforeEach(async ({ context }) => {
    await context.addCookies([
      {
        name: 'userlang',
        value: 'en',
        domain: '.tiket.com',
        path: '/',
      },
      {
        name: 'tiket_currency',
        value: 'USD',
        domain: '.tiket.com',
        path: '/',
      },
    ]);
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/ab-id${path}?currency=SGD`;
    const expectedUrl = `${BASE_URL}/en-id${path}`;
    const expectedText = PAGE_EXPECTED_TEXT_EN[path];

    test(`should redirect to ${expectedUrl} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('header').getByText('USD')).toBeVisible();

      if (shouldValidateText) {
        await expect(page.getByText(expectedText).first()).toBeVisible();
      }
    });
  }
});

