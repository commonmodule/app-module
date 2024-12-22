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
    private normalizeLanguageCode;
    get languageCode(): string;
    set languageCode(lang: string);
}
declare const _default: BrowserInfo;
export default _default;
//# sourceMappingURL=BrowserInfo.d.ts.map