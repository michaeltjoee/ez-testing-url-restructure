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

### Run all tests

```bash
pnpm exec playwright test
```

### Run specific test file

```bash
# Main logic tests (en-us with USD currency)
pnpm exec playwright test mainLogic

# Logged out user with cookies tests
pnpm exec playwright test logoutLogin

# Non-targeted country and locale tests (TEST CASE 6, 7, 8, 9, 10)
pnpm exec playwright test nonTargetedCountryAndLocale

# Non-targeted locale tests (TEST CASE 11, 12, 13, 20, 21, 22)
pnpm exec playwright test nonTargetedLocale

# Invalid path redirection tests (TEST CASE 41-43)
pnpm exec playwright test invalidPathRedirection

# EN domain tests (TEST CASE 44, 45, 46, 47, 50)
pnpm exec playwright test enDomain

# M domain tests (TEST CASE 48, 49, 51)
pnpm exec playwright test mDomain
```

### Run tests in headed mode (see browser)

```bash
pnpm exec playwright test --headed
```

### Run tests in UI mode

```bash
pnpm exec playwright test --ui
```

### Run tests for specific browser

```bash
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
```

## Environment Configuration

Tests support two environments: **preprod** (default) and **production**.

### Preprod (default)

```bash
pnpm exec playwright test
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
| `environment` | `preprod`, `production` | `preprod` | Target environment for tests |
| `isUsingJapanVPN` | `true`, `false` | `false` | Set to `true` when running tests through a Japan VPN to simulate Japanese IP geolocation |
| `validateText` | `true`, `false` | `false` | Set to `true` to enable path-specific text validation (e.g., "Enjoy our great ongoing promos!" on /promo page) |

## Domain Configuration

| Environment | EN Domain | M Domain | Base URL |
|-------------|-----------|----------|----------|
| Preprod | en.preprod.tiket.com | m.preprod.tiket.com | preprod.tiket.com |
| Production | en.tiket.com | m.tiket.com | tiket.com |

## Test Cases

### Main Logic - en-us with USD Currency
Tests that `/en-us` locale stays on the same URL and displays USD currency in the header.

- `/en-us` should stay on `/en-us` and display USD currency
- Tests all page paths (home, explore, voucher-box, promo, destination)

### Logged Out User with Cookies
Tests for logged out users with `userlang` and `tiket_currency` cookies set.

- `/en-us` with `userlang=id` and `tiket_currency=IDR` cookies redirects to `/id-us` with IDR currency
- Tests all page paths with cookie-based locale/currency override

### Non-Targeted Country and Locale (TEST CASE 6, 7, 8, 9, 10)
Tests for non-targeted countries with various locale and currency settings. These tests simulate users from different regions using browser locale/timezone settings.

- **TEST CASE 6**: `/en-in` (India locale) redirects to `/en-sg` with SGD currency
- **TEST CASE 7**: `/hi-in?currency=INR` with Chinese browser locale redirects to `/en-sg?currency=SGD`
- **TEST CASE 8**: `/en-in?currency=SGD` redirects to `/en-us?currency=SGD` with SGD currency preserved
- **TEST CASE 9**: Additional non-targeted country tests
- **TEST CASE 10**: Additional locale/currency combination tests

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
- **TEST CASE 44**: EN domain redirects to `/en-sg` with SGD currency
- **TEST CASE 45**: With `userlang=id` and `tiket_currency=IDR` cookies, redirects to `/id-sg` with IDR currency
- **TEST CASE 46**: EN domain with `/en-us` path maintains locale-country with USD currency
- **TEST CASE 47**: With cookies, `/en-us` path redirects to `/id-us` with IDR currency
- **TEST CASE 50**: Currency query param `?currency=IDR` is preserved and displays IDR

### M Domain Redirection (TEST CASE 48, 49, 51)
- **TEST CASE 48**: M domain (legacy mobile) redirects to `/en-sg` with SGD currency
- **TEST CASE 49**: M domain with `/en-us` path redirects to `/en-us` with USD currency
- **TEST CASE 51**: M domain with `?currency=IDR` query param redirects to `/en-sg?currency=IDR` with IDR currency

## View Test Report

After running tests, view the HTML report:

```bash
pnpm exec playwright show-report
```

## Project Structure

```
├── tests/
│   ├── constants.ts                                    # Shared constants (BASE_URL, EN_DOMAIN, M_DOMAIN, PAGE_PATHS)
│   ├── mainLogic(4,5).spec.ts                          # Main logic tests (en-us with USD)
│   ├── logoutLogin.spec.ts                             # Logged out user with cookies tests
│   ├── nonTargetedCountryAndLocale (6,7,8,9,10).spec.ts  # Non-targeted country/locale tests
│   ├── nonTargetedLocale(11,12,13,20,21,22).spec.ts    # Non-targeted locale tests
│   ├── invalidPathRedirection(41-43).spec.ts           # Invalid path redirection tests
│   ├── enDomain(44,45,46,47,50).spec.ts                # EN domain tests
│   └── mDomain(48,49,51).spec.ts                       # M domain tests
├── playwright.config.ts                                # Playwright configuration
├── .env                                                # Environment variables (git ignored)
├── .env.sample                                         # Sample environment file
├── package.json
└── README.md
```

## Simulating User Geolocation

The tests use Playwright's browser context options to simulate users from different regions:

```typescript
test.use({
  // Set geolocation coordinates
  geolocation: { longitude: 8.5417, latitude: 47.3769 },
  permissions: ['geolocation'],
  // Set browser locale
  locale: 'zh-CN',
  // Set timezone
  timezoneId: 'Asia/Shanghai',
});
```

**Note:** These settings affect browser-based geolocation APIs. For IP-based geolocation (used by Cloudflare), you need to use a VPN or proxy service. Set `isUsingJapanVPN=true` in `.env` when testing through a Japan VPN.
