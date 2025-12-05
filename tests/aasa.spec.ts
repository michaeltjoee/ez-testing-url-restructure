import { test, expect } from "@playwright/test";
import { BASE_URL, env } from "./constants";

// Expected AASA responses for each environment
const EXPECTED_AASA: Record<string, object> = {
  preprod: {
    domain: "tiket.com",
    version: "8",
    subdomain: [
      "m.preprod",
      "preprod",
      "en.preprod",
      "mpayment.preprod",
      "payment.preprod",
    ],
    applinks: {
      details: [
        {
          appIDs: ["R8EMKFHGH9.com.mobile.ios.Tiket.preprod"],
          components: [
            { "#": "no_universal_links", exclude: true },
            { "/": "/*" },
          ],
        },
      ],
    },
  },
  staging: {
    domain: "tiket.com",
    version: "8",
    subdomain: [
      "m.gatotkaca",
      "gatotkaca",
      "en.gatotkaca",
      "mpayment-gatotkaca",
      "payment-gatotkaca",
    ],
    applinks: {
      details: [
        {
          appIDs: [
            "R8EMKFHGH9.com.mobile.ios.Tiket.dev",
            "R8EMKFHGH9.com.mobile.ios.Tiket.preprod",
            "R8EMKFHGH9.com.mobile.ios.Tiket",
          ],
          components: [
            { "#": "no_universal_links", exclude: true },
            { "/": "/*" },
          ],
        },
      ],
    },
  },
  production: {
    domain: "tiket.com",
    version: "8",
    subdomain: ["m", "www", "en", "mpayment", "payment"],
    applinks: {
      details: [
        {
          appIDs: ["R8EMKFHGH9.com.mobile.ios.Tiket"],
          components: [
            { "#": "no_universal_links", exclude: true },
            { "/": "/*" },
          ],
        },
      ],
    },
  },
};

test.describe("Apple App Site Association (AASA)", () => {
  test(`should return correct AASA response for ${env} environment`, async ({
    request,
  }) => {
    const response = await request.get(
      `${BASE_URL}/.well-known/apple-app-site-association`
    );

    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("application/json");

    const responseBody = await response.json();
    const expectedResponse = EXPECTED_AASA[env];

    expect(responseBody).toEqual(expectedResponse);
  });
});

