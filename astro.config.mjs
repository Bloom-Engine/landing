import { defineConfig } from "astro/config";

export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: [
      "en",
      "de",
      "es",
      "fr",
      "it",
      "ja",
      "ko",
      "pt",
      "th",
      "tr",
      "vi",
      "id",
      "zh-Hans",
    ],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
