import Store from "../store/Store.js";
class BrowserInfo {
    _isAndroid;
    _isIOS;
    _isPageVisible = !document.hidden;
    store = new Store("browser-info");
    constructor() {
        document.addEventListener("visibilitychange", () => {
            this._isPageVisible = !document.hidden;
        });
    }
    isAndroid() {
        return this._isAndroid ??
            (this._isAndroid = /Android/i.test(navigator.userAgent));
    }
    isIOS() {
        return this._isIOS ??
            (this._isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
    isMobileDevice() {
        return this.isAndroid() || this.isIOS();
    }
    isPageVisible() {
        return this._isPageVisible;
    }
    normalizeLanguageCode(lang) {
        const [mainLang, region] = lang.toLowerCase().split("-");
        if (mainLang === "zh") {
            return region === "tw" || region === "hk" ? "zh-TW" : "zh-CN";
        }
        return mainLang;
    }
    get languageCode() {
        const storedLang = this.store.get("lang");
        if (storedLang)
            return storedLang;
        const fullLang = navigator.language ||
            (navigator.languages && navigator.languages[0]) || "en-US";
        return this.normalizeLanguageCode(fullLang);
    }
    set languageCode(lang) {
        this.store.setPermanent("lang", this.normalizeLanguageCode(lang));
    }
}
export default new BrowserInfo();
//# sourceMappingURL=BrowserInfo.js.map