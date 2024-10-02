import Store from "../store/Store.js";

class BrowserInfo {
  private _isAndroid: boolean | undefined;
  private _isIOS: boolean | undefined;

  private store = new Store("browser-info");

  public get isAndroid() {
    return this._isAndroid ??
      (this._isAndroid = /Android/i.test(navigator.userAgent));
  }

  public get isIOS() {
    return this._isIOS ??
      (this._isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent));
  }

  public get isMobileDevice() {
    return this.isAndroid || this.isIOS;
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
