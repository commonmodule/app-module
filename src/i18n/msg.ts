import Browser from "../utils/Browser.js";
import I18nMessageManager from "./I18nMessageManager.js";

export default function msg(
  key: string,
  params?: Record<string, string | number>,
): string {
  const message = I18nMessageManager.getMessage(Browser.languageCode, key);
  if (!params) return message;
  return message.replace(/%\{(\w+)\}/g, (match, paramKey) => {
    const replacement = params[paramKey];
    return replacement !== undefined ? String(replacement) : match;
  });
}
