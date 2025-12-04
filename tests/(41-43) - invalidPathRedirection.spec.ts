import { test, expect } from '@playwright/test';
import { BASE_URL, PAGE_PATHS } from './constants';

const INVALID_LOCALE_COUNTRY_CASES = [
  '/a-b',       // 1 digit
  '/abc-abc',   // 3 digit
  '/abcd-abcd', // 4 digit
];

const EXPECTED_URL = `${BASE_URL}/en-sg`;

const pathsToTest = INVALID_LOCALE_COUNTRY_CASES.flatMap(locale => 
  PAGE_PATHS.map(page => `${locale}${page}`)
);

test.describe('TEST CASE: 41, 42, 43', () => {
  for (const path of pathsToTest) {
    const url = `${BASE_URL}${path}`;
    test(`should redirect to ${EXPECTED_URL} from ${url}`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveURL(EXPECTED_URL);
      await expect(page.locator('text=SGD').first()).toBeVisible();
    });
  }
});
