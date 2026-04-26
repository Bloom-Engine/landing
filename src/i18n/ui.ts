import en from "../messages/en.json";
import de from "../messages/de.json";
import es from "../messages/es.json";
import fr from "../messages/fr.json";
import it from "../messages/it.json";
import ja from "../messages/ja.json";
import ko from "../messages/ko.json";
import pt from "../messages/pt.json";
import th from "../messages/th.json";
import tr from "../messages/tr.json";
import vi from "../messages/vi.json";
import id from "../messages/id.json";
import zhHans from "../messages/zh-Hans.json";

export const locales = [
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
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  ja: "日本語",
  ko: "한국어",
  pt: "Português",
  th: "ไทย",
  tr: "Türkçe",
  vi: "Tiếng Việt",
  id: "Indonesia",
  "zh-Hans": "中文",
};

const messages: Record<Locale, Record<string, unknown>> = {
  en,
  de,
  es,
  fr,
  it,
  ja,
  ko,
  pt,
  th,
  tr,
  vi,
  id,
  "zh-Hans": zhHans,
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/**
 * Get a translation value by dot-notation key. Falls back to English then to the key itself.
 */
export function tFor(locale: Locale) {
  return function t(key: string): string {
    const value = lookup(messages[locale], key) ?? lookup(messages.en, key);
    return typeof value === "string" ? value : key;
  };
}

/**
 * Get a translation array (e.g. for whatsnew cards or modules) by key. Always falls back to English.
 */
export function tListFor(locale: Locale) {
  return function tList<T = Record<string, string>>(key: string): T[] {
    const value = lookup(messages[locale], key) ?? lookup(messages.en, key);
    return Array.isArray(value) ? (value as T[]) : [];
  };
}

function lookup(obj: Record<string, unknown> | undefined, path: string): unknown {
  if (!obj) return undefined;
  const parts = path.split(".");
  let cur: unknown = obj;
  let i = 0;
  while (i < parts.length) {
    if (!cur || typeof cur !== "object") return undefined;
    const node = cur as Record<string, unknown>;
    let matched = false;
    // Greedy longest-prefix match so flat keys with dots in them
    // (e.g. "h.pitch", "li.box1") resolve correctly alongside nested keys.
    for (let end = parts.length; end > i; end--) {
      const key = parts.slice(i, end).join(".");
      if (key in node) {
        cur = node[key];
        i = end;
        matched = true;
        break;
      }
    }
    if (!matched) return undefined;
  }
  return cur;
}

/**
 * Build a path with the right locale prefix. English (default) has no prefix.
 */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean;
  return `/${locale}${clean === "/" ? "" : clean}`;
}
