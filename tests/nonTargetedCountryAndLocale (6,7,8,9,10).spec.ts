import { test, expect } from '@playwright/test';
import { BASE_URL, PAGE_PATHS } from './constants';

test.describe('Entered url has non-targetted country and language without currency param and no user preference (TEST CASE 6)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-in${path}`;
    const expectedUrl = `${BASE_URL}/en-sg${path}`;

    test(`should redirect ${url} to ${expectedUrl} and display SGD currency`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(expectedUrl);
      await expect(page.locator('text=SGD').first()).toBeVisible();
    });
  }
});

test.describe('Entered url has non-targetted country and language without currency param and no user preference (TEST CASE 7, 8)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('should redirect /en-ch to /en-sg?currency=SGD and display SGD currency', async ({ page }) => {
    const url = `${BASE_URL}/en-ch`;
    const expectedUrl = `${BASE_URL}/en-sg`;

    await page.goto(url);

    await expect(page).toHaveURL(expectedUrl);
    await expect(page.locator('text=SGD').first()).toBeVisible();
  });
});


test.describe('User with Chinese locale visiting hi-in with INR currency (TEST CASE 9)', () => {
  // Simulate user with Chinese browser locale
  test.use({
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  });

  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/hi-in${path}?currency=INR`;
    const expectedUrl = `${BASE_URL}/en-sg${path}?currency=SGD`;

    test(`should redirect ${url} to ${expectedUrl} and display SGD in header`, async ({ page }) => {
      await page.goto(url);

      // Expect redirect to en-us with USD currency
      await expect(page).toHaveURL(expectedUrl);

      // Expect USD currency to be visible in the header
      await expect(page.locator('header').getByText('SGD')).toBeVisible();
    });
  }
});

test.describe('User visiting en-in with SGD currency query param (TEST CASE 10)', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  for (const path of PAGE_PATHS) {
    const url = `${BASE_URL}/en-in${path}?currency=SGD`;
    const expectedUrl = `${BASE_URL}/en-sg${path}?currency=SGD`;

    test(`should redirect ${url} to ${expectedUrl} and display SGD in header`, async ({ page }) => {
      await page.goto(url);

      // Expect redirect to en-us with SGD currency preserved
      await expect(page).toHaveURL(expectedUrl);

      // Expect SGD currency to be visible in the header
      await expect(page.locator('header').getByText('SGD')).toBeVisible();
    });
  }
});

