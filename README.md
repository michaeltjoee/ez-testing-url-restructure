# Tiket.com Redirect Tests

Playwright E2E tests for validating tiket.com domain redirections and locale/currency behavior.

## Prerequisites

- Node.js >= 18
- pnpm (or npm/yarn)

## Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install
```

## Running Tests

### Recommended: Run tests in UI mode

The best way to run and debug tests is using Playwright's interactive UI mode:

```bash
pnpm exec playwright test --ui
```

This opens an interactive interface where you can:
- See all test files and cases
- Run individual tests or test suites
- Watch tests execute in real-time
- View detailed test traces and screenshots
- Debug failing tests easily

### Run all tests (headless)

```bash
pnpm exec playwright test
```

### Run specific test file

```bash
# Main logic tests (TEST CASE 4, 5, 14, 15, 16, 23)
pnpm exec playwright test "mainLogic"

# Non-targeted country and locale tests (TEST CASE 6, 7, 8, 9, 10, 17, 18, 19)
pnpm exec playwright test "nonTargetedCountryAndLocale"

# Non-targeted locale tests (TEST CASE 11, 12, 13, 20, 21, 22)
pnpm exec playwright test "nonTargetedLocale"

# Logged out user with initial preference tests (TEST CASE 31, 32, 33)
pnpm exec playwright test "logoutLogin with initial preference"

# User without initial preference tests (TEST CASE 34, 35, 36)
pnpm exec playwright test "logoutLogin without initial preference"

# Invalid path redirection tests (TEST CASE 41-43)
pnpm exec playwright test "invalidPathRedirection"

# EN domain tests (TEST CASE 44, 45, 46, 47, 50)
pnpm exec playwright test "enDomain"

# M domain tests (TEST CASE 48, 49, 51)
pnpm exec playwright test "mDomain"

# Case-insensitive locale redirect tests
pnpm exec playwright test "important"

# Apple App Site Association (AASA) tests
pnpm exec playwright test "aasa"
```

### Run tests in headed mode (see browser)

```bash
pnpm exec playwright test --headed
```

### Run tests for specific browser

```bash
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
```

## Environment Configuration

Tests support three environments: **preprod** (default), **staging**, and **production**.

### Preprod (default)

```bash
pnpm exec playwright test
```

### Staging

```bash
environment=staging pnpm exec playwright test
```

### Production

```bash
environment=production pnpm exec playwright test
```

### Using .env file

Create a `.env` file in the project root:

```env
environment=preprod
isUsingJapanVPN=false
validateText=false
```

### Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `environment` | `preprod`, `staging`, `production` | `preprod` | Target environment for tests |
| `isUsingJapanVPN` | `true`, `false` | `false` | Set to `true` when running tests through a Japan VPN to simulate Japanese IP geolocation |
| `validateText` | `true`, `false` | `false` | Set to `true` to enable path-specific text validation (e.g., "Enjoy our great ongoing promos!" on /promo page) |

## Domain Configuration

| Environment | EN Domain | M Domain | Base URL |
|-------------|-----------|----------|----------|
| Preprod | en.preprod.tiket.com | m.preprod.tiket.com | preprod.tiket.com |
| Staging | en.gatotkaca.tiket.com | m.gatotkaca.tiket.com | gatotkaca.tiket.com |
| Production | en.tiket.com | m.tiket.com | tiket.com |

## Test Cases

### Main Logic - en-us with USD Currency (TEST CASE 4, 5, 14, 15, 16, 23)
Tests that `/en-us` locale stays on the same URL and displays USD currency in the header.

- **TEST CASE 4**: `/en-us` should stay on `/en-us` and display USD currency
- **TEST CASE 5**: `/en-us?currency=IDR` should stay on same URL and display IDR currency
- **TEST CASE 14**: `/en-us?currency=INR` (unknown currency) should redirect to `/en-us?currency=USD` and display USD currency
- **TEST CASE 15**: `/en-us` with `tiket_currency=SGD` cookie should stay on `/en-us` and display SGD currency from cookie
- **TEST CASE 16**: `/en-us?currency=IDR` with `tiket_currency=SGD` cookie should redirect to `/en-us` (currency param removed) and display SGD currency (cookie overrides query param)
- **TEST CASE 23**: `/en-us?currency=INR` with `userlang=en` and `tiket_currency=USD` cookies should redirect to `/en-us` (currency param removed) and display USD currency (cookie overrides unknown currency)
- Tests all page paths (home, explore, voucher-box, promo, destination)

### Logged Out User with Initial Preference (TEST CASE 31, 32, 33)
Tests for logged out users with initial `userlang=id` and `tiket_currency=IDR` cookies set.

- User visits `/en-us` with cookies → redirects to `/id-us` with IDR currency
- Simulate login (userlang=en, tiket_currency=USD) → redirects to `/en-us` with USD currency
- Refresh page → stays on `/en-us` with USD currency (cookies persist)

### User Without Initial Preference (TEST CASE 34, 35, 36)
Tests for users without any initial cookies visiting `/en-id`.

- User visits `/en-id` without cookies → stays on `/en-id` with IDR currency
- Simulate login (userlang=en, tiket_currency=IDR) → stays on `/en-id` with IDR currency
- Refresh page → stays on `/en-id` with IDR currency (cookies persist)

### Non-Targeted Country and Locale (TEST CASE 6, 7, 8, 9, 10, 17, 18, 19)
Tests for non-targeted countries with various locale and currency settings. These tests simulate users from different regions using browser locale/timezone settings.

- **TEST CASE 6**: `/en-in` (India locale) redirects to `/en-sg` with SGD currency
- **TEST CASE 7**: `/hi-in?currency=INR` with Chinese browser locale redirects to `/en-sg?currency=SGD`
- **TEST CASE 8**: `/en-in?currency=SGD` redirects to `/en-us?currency=SGD` with SGD currency preserved
- **TEST CASE 9**: Additional non-targeted country tests
- **TEST CASE 10**: Additional locale/currency combination tests
- **TEST CASE 17**: `/en-in` with `userlang=en` and `tiket_currency=SGD` cookies redirects to `/en-us` (with Japan VPN) or `/en-sg` with SGD currency
- **TEST CASE 18**: `/en-au` (Australia) with Japan VPN redirects to `/en-us?currency=JPY` with JPY currency
- **TEST CASE 19**: `/en-in?currency=SGD` with Japan VPN redirects to `/en-us` (currency param removed) with SGD currency

### Non-Targeted Locale (TEST CASE 11, 12, 13, 20, 21, 22)
Tests for non-supported locale codes with various browser settings and cookies.

- **TEST CASE 11**: `/ab-us` with browser locale `id-ID` redirects to `/id-us` with USD currency
- **TEST CASE 12**: `/ab-id` with browser locale `id-ID` redirects to `/id-id` with IDR currency
- **TEST CASE 13**: `/ab-id?currency=SGD` with default browser locale redirects to `/en-id?currency=SGD` with SGD currency
- **TEST CASE 20**: `/ab-us` with `userlang=en` and `tiket_currency=USD` cookies redirects to `/en-us` with USD currency
- **TEST CASE 21**: `/ab-id` with `userlang=en` and `tiket_currency=USD` cookies redirects to `/en-id` with USD currency
- **TEST CASE 22**: `/ab-id?currency=SGD` with `userlang=en` and `tiket_currency=USD` cookies redirects to `/en-id` with USD currency (cookie overrides query param)

### Invalid Path Redirection (TEST CASE 41-43)
Tests that invalid locale-country paths redirect to `/en-sg` with SGD currency.

### EN Domain Redirection (TEST CASE 44-47, 50)

> ⚠️ **TODO: DOUBLE CHECK ON PRODUCTION (MAY FALSE POSITIVE)**

- **TEST CASE 44**: EN domain redirects to `/en-sg` with SGD currency
- **TEST CASE 45**: With `userlang=id` and `tiket_currency=IDR` cookies, redirects to `/id-sg` with IDR currency
- **TEST CASE 46**: EN domain with `/en-us` path maintains locale-country with USD currency
- **TEST CASE 47**: With cookies, `/en-us` path redirects to `/id-us` with IDR currency
- **TEST CASE 50**: Currency query param `?currency=IDR` is preserved and displays IDR

### M Domain Redirection (TEST CASE 48, 49, 51)

> ⚠️ **TODO: DOUBLE CHECK ON PRODUCTION (MAY FALSE POSITIVE)**

- **TEST CASE 48**: M domain (legacy mobile) redirects to `/en-sg` with SGD currency
- **TEST CASE 49**: M domain with `/en-us` path redirects to `/en-us` with USD currency
- **TEST CASE 51**: M domain with `?currency=IDR` query param redirects to `/en-sg?currency=IDR` with IDR currency

### Case-Insensitive Locale Redirect
Tests that uppercase locale-country codes redirect to lowercase.

- `/EN-US` should redirect to `/en-us` with USD currency
- `/ID-ID` should redirect to `/id-id` with IDR currency
- Tests all page paths (home, explore, voucher-box, promo, destination)

### Apple App Site Association (AASA)
Tests that the `/.well-known/apple-app-site-association` endpoint returns the correct JSON response for the current environment.

- Verifies response matches expected AASA configuration for preprod, staging, or production
- Validates correct appIDs, subdomains, and applinks configuration

## View Test Report

After running tests, view the HTML report:

```bash
pnpm exec playwright show-report
```

## Project Structure

```
├── tests/
│   ├── constants.ts                                                  # Shared constants (BASE_URL, EN_DOMAIN, M_DOMAIN, PAGE_PATHS)
│   ├── (4,5,14,15,16,23) - mainLogic.spec.ts                         # Main logic tests (en-us with USD)
│   ├── (6,7,8,9,10,17,18,19) - nonTargetedCountryAndLocale.spec.ts   # Non-targeted country/locale tests
│   ├── (11,12,13,20,21,22) - nonTargetedLocale.spec.ts               # Non-targeted locale tests
│   ├── (31,32,33) - logoutLogin with initial preference.spec.ts      # User with initial cookies tests
│   ├── (34,35,36) - logoutLogin without initial preference.spec.ts   # User without initial cookies tests
│   ├── (41-43) - invalidPathRedirection.spec.ts                      # Invalid path redirection tests
│   ├── (44,45,46,47,50) - enDomain.spec.ts                           # EN domain tests
│   ├── (48,49,51) - mDomain.spec.ts                                  # M domain tests
│   ├── important.spec.ts                                             # Case-insensitive locale redirect tests
│   └── aasa.spec.ts                                                  # Apple App Site Association tests
├── playwright.config.ts                                # Playwright configuration
├── .env                                                # Environment variables (git ignored)
├── .env.sample                                         # Sample environment file
├── package.json
└── README.md
```
