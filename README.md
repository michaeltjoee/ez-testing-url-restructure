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
```

## Domain Configuration

| Environment | EN Domain | M Domain | Base URL |
|-------------|-----------|----------|----------|
| Preprod | en.preprod.tiket.com | m.preprod.tiket.com | preprod.tiket.com |
| Production | en.tiket.com | m.tiket.com | tiket.com |

## Test Cases

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
│   ├── constants.ts                          # Shared constants (BASE_URL, EN_DOMAIN, M_DOMAIN, PAGE_PATHS)
│   ├── invalidPathRedirection(41-43).spec.ts
│   ├── enDomain(44,45,46,47,50).spec.ts
│   └── mDomain(48,49,51).spec.ts
├── playwright.config.ts                      # Playwright configuration
├── package.json
└── README.md
```

