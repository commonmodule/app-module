import Store from "../store/Store.js";
class Browser {
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
    hasPageFocus() {
        return document.hasFocus();
    }
    isDarkMode() {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
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
    async share(data) {
        if (navigator.share) {
            try {
                await navigator.share(data);
            }
            catch (error) {
                console.error("Error sharing:", error);
            }
        }
        else {
            try {
                await navigator.clipboard.writeText(data.url);
                alert("Link copied to clipboard.");
            }
            catch (error) {
                console.error("Error copying to clipboard:", error);
                alert("Sharing not supported on this browser.");
            }
        }
    }
    enterFullscreen(domNode) {
        domNode.htmlElement.requestFullscreen();
    }
    isFullscreen() {
        return Boolean(document.fullscreenElement);
    }
    exitFullscreen() {
        document.exitFullscreen();
    }
}
export default new Browser();
//# sourceMappingURL=Browser.js.map