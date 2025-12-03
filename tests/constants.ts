const env = process.env.environment || 'preprod';

export const BASE_URL = env === 'production' 
  ? 'https://tiket.com' 
  : 'https://preprod.tiket.com';

export const EN_DOMAIN = env === 'production'
  ? 'https://en.tiket.com'
  : 'https://en.preprod.tiket.com';

export const M_DOMAIN = env === 'production'
  ? 'https://m.tiket.com'
  : 'https://m.preprod.tiket.com';

export const PAGE_PATHS = [
  '',
  '/explore/japan',
  '/voucher-box',
  '/promo',
  '/destination/japan',
];
