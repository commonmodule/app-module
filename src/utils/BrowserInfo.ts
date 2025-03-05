import Store from "../store/Store.js";

class BrowserInfo {
  private _isAndroid: boolean | undefined;
  private _isIOS: boolean | undefined;
  private _isPageVisible: boolean = !document.hidden;

  private store = new Store("browser-info");

  constructor() {
    document.addEventListener("visibilitychange", () => {
      this._isPageVisible = !document.hidden;
    });
  }

  public isAndroid() {
    return this._isAndroid ??
      (this._isAndroid = /Android/i.test(navigator.userAgent));
  }

  public isIOS() {
    return this._isIOS ??
      (this._isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent));
  }

  public isMobileDevice() {
    return this.isAndroid() || this.isIOS();
  }

  public isPageVisible() {
    return this._isPageVisible;
  }

  public hasPageFocus() {
    return document.hasFocus();
  }

  public isDarkMode() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  private normalizeLanguageCode(lang: string): string {
    const [mainLang, region] = lang.toLowerCase().split("-");
    if (mainLang === "zh") {
      return region === "tw" || region === "hk" ? "zh-TW" : "zh-CN";
    }
    return mainLang;
  }

  public get languageCode(): string {
    const storedLang = this.store.get<string | undefined>("lang");
    if (storedLang) return storedLang;

    const fullLang = navigator.language ||
      (navigator.languages && navigator.languages[0]) || "en-US";
    return this.normalizeLanguageCode(fullLang);
  }

  public set languageCode(lang: string) {
    this.store.setPermanent("lang", this.normalizeLanguageCode(lang));
  }
}

export default new BrowserInfo();
