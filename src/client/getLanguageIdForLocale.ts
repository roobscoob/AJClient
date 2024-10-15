import { Language } from "../protocol/customSmartFoxMessages/C2SLogin";

// Copied directly from AnimalJam source. We're not as racist as them we swear.

export function getLanguageIdForLocale(locale: string): Language {
  if (locale.indexOf("-") !== -1)
    locale = locale.substring(0, locale.indexOf("-"));

  switch (locale) {
    case "en":
    case "eng":
      return Language.English;
    case "es":
    case "spa":
      return Language.Spanish;
    case "pt":
    case "por":
      return Language.Portuguese;
    case "fr":
    case "fra":
    case "fre":
      return Language.French;
    case "de":
    case "deu":
    case "ger":
      return Language.Deutsch;
    default:
      return Language.Unknown;
  }
}
