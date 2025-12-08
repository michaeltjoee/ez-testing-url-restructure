import { test, expect } from "@playwright/test";
import {
  BASE_URL,
  PAGE_PATHS,
  PAGE_EXPECTED_TEXT_EN,
  env,
  PRODUCTION_EXPECTED_COUNTRY_CODE,
  PRODUCTION_EXPECTED_CURRENCY,
} from "./constants";

const isUsingJapanVPN = process.env.isUsingJapanVPN === "true";
const shouldValidateText = process.env.validateText === "true";

const INVALID_LOCALE_COUNTRY_CASES = [
  "/a-b", // 1 digit
  "/abc-abc", // 3 digit
  "/abcd-abcd", // 4 digit
];

const expectedCurrency =
  env === "production"
    ? PRODUCTION_EXPECTED_CURRENCY
    : isUsingJapanVPN
      ? "JPY"
      : "SGD";

const expectedUrl =
  env === "production"
    ? `${BASE_URL}/en-${PRODUCTION_EXPECTED_COUNTRY_CODE}`
    : isUsingJapanVPN
      ? `${BASE_URL}/en-us?currency=JPY`
      : `${BASE_URL}/en-sg`;

const expectedText = PAGE_EXPECTED_TEXT_EN[""];

// TODO: DOUBLE CHECK ON PRODUCTION (MAY FALSE POSITIVE)
test.describe("TEST CASE: 41, 42, 43", () => {
  for (const invalidLocale of INVALID_LOCALE_COUNTRY_CASES) {
    for (const path of PAGE_PATHS) {
      const url = `${BASE_URL}${invalidLocale}${path}`;

      test(`should redirect to ${expectedUrl} from ${url}`, async ({
        page,
      }) => {
        await page.goto(url);

        await expect(page).toHaveURL(expectedUrl);
        await expect(
          page.locator(`text=${expectedCurrency}`).first()
        ).toBeVisible();

        if (shouldValidateText) {
          await expect(page.getByText(expectedText).first()).toBeVisible();
        }
      });
    }
  }
});
