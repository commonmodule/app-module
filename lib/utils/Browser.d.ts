import Dom from "../dom/Dom.js";
declare class Browser {
    private _isAndroid;
    private _isIOS;
    private _isPageVisible;
    private store;
    constructor();
    isAndroid(): boolean;
    isIOS(): boolean;
    isMobileDevice(): boolean;
    isPageVisible(): boolean;
    hasPageFocus(): boolean;
    isDarkMode(): boolean;
    private normalizeLanguageCode;
    get languageCode(): string;
    set languageCode(lang: string);
    share(data: {
        title: string;
        url: string;
    }): Promise<void>;
    download(url: string): Promise<void>;
    enterFullscreen(dom: Dom): void;
    isFullscreen(): boolean;
    exitFullscreen(): void;
}
declare const _default: Browser;
export default _default;
//# sourceMappingURL=Browser.d.ts.map