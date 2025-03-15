declare class BrowserInfo {
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
}
declare const _default: BrowserInfo;
export default _default;
//# sourceMappingURL=BrowserInfo.d.ts.map