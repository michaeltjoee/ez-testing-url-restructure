const env = process.env.environment || "preprod";

export const BASE_URL =
  env === "production" ? "https://www.tiket.com" : "https://preprod.tiket.com";

export const EN_DOMAIN =
  env === "production"
    ? "https://en.tiket.com"
    : "https://en.preprod.tiket.com";

export const M_DOMAIN =
  env === "production" ? "https://m.tiket.com" : "https://m.preprod.tiket.com";

const EXPLORE_PATH =
  env === "production" ? "/explore/flight-tiket-best-deals" : "/explore/japan";

export const PAGE_PATHS = [
  "",
  EXPLORE_PATH,
  "/voucher-box",
  "/promo",
  "/destination/japan",
];

// Path-specific expected text for English locale (en)
export const PAGE_EXPECTED_TEXT_EN: Record<string, string> = {
  "": "Hey there, going anywhere?", // Home page
  [EXPLORE_PATH]: "Register", // Explore page
  "/voucher-box": "Use your vouchers to save even more on transactions!", // Voucher box page
  "/promo": "Enjoy our great ongoing promos!", // Promo page
  "/destination/japan": `Register`, // Destination page
};

// Path-specific expected text for Indonesian locale (id)
export const PAGE_EXPECTED_TEXT_ID: Record<string, string> = {
  "": "Hai kamu, mau ke mana?", // Home page
  [EXPLORE_PATH]: "Masuk", // Explore page
  "/voucher-box": "Pakai voucher yang kamu punya biar transaksi jadi lebih hemat!", // Voucher box page
  "/promo": "Nikmati berbagai promo terbaik saat ini!", // Promo page
  "/destination/japan": `Daftar`, // Destination page
};

// Locale validation text - confirms the user's active locale
export const LOCALE_TEXT = {
  en: "Your Orders", // English locale indicator
  id: "Pesananmu", // Indonesian locale indicator
};
