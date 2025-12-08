import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import { BLIBLITIKET_LOGIN_URL, BASE_URL } from "./constants";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

test.describe("Bliblitiket Login Page", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("should navigate to bliblitiket login page with query parameters", async ({
    page,
  }) => {
    const loginUrl = `${BLIBLITIKET_LOGIN_URL}?clientId=9dc79e3916a042abc86c2aa525bff009&ref=${encodeURIComponent(
      `${BASE_URL}/en-sg?utm_section=navigationBar%3Blogin_label&utm_logic=none`
    )}&device_id=5fea17b2-8d0e-41bd-9e42-d4144f198e27&lang=en&utm_section=navigationBar%3Blogin_label&utm_logic=none`;

    await page.goto(loginUrl);

    // Verify we're on the login page
    await expect(page).toHaveURL(/bliblitiket\.com\/login/);

    // Verify the login button is visible and click it
    await expect(
      page.getByRole("button", { name: "Continue with Phone or Email" })
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Continue with Phone or Email" })
      .click();

    // Verify the phone/email input is visible and enter phone number
    await expect(page.locator("#phone-number-or-email")).toBeVisible();
    await page.locator("#phone-number-or-email").fill("081280128182");

    // Click Continue button and verify OTP input shows
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByTestId("otp-input-1")).toBeVisible();

    // Enter OTP code 123456
    await page.getByTestId("otp-input-1").fill("1");
    await page.getByTestId("otp-input-2").fill("2");
    await page.getByTestId("otp-input-3").fill("3");
    await page.getByTestId("otp-input-4").fill("4");
    await page.getByTestId("otp-input-5").fill("5");
    await page.getByTestId("otp-input-6").fill("6");

    // Email OTP verification - fill OTP again if required
    const emailOtpText = page.getByText("Enter the code sent via email");
    if (await emailOtpText.isVisible({ timeout: 3000 }).catch(() => false)) {
      await page.getByTestId("otp-input-1").fill("1");
      await page.getByTestId("otp-input-2").fill("2");
      await page.getByTestId("otp-input-3").fill("3");
      await page.getByTestId("otp-input-4").fill("4");
      await page.getByTestId("otp-input-5").fill("5");
      await page.getByTestId("otp-input-6").fill("6");
    }

    // Skip additional verification
    await page.getByRole("button", { name: "Skip for now" }).click();

    // Verify "MM" text is visible in header
    await expect(page.locator("header").getByText("MM")).toBeVisible();

    // Get storage state and filter out specific cookies
    const storageState = await page.context().storageState();

    // Cookies to exclude (add cookie names you want to exclude)
    const excludedCookies = ["userlang", "tiket_currency"];

    storageState.cookies = storageState.cookies.filter(
      (cookie) => !excludedCookies.includes(cookie.name)
    );

    // Save filtered storage state
    fs.writeFileSync(authFile, JSON.stringify(storageState, null, 2));
  });
});
