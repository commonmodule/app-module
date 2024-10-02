import BrowserInfo from "../utils/BrowserInfo.js";
import I18nMessageManager from "./I18nMessageManager.js";

export default function msg(key: string): string {
  return I18nMessageManager.getMessage(BrowserInfo.languageCode, key);
}
