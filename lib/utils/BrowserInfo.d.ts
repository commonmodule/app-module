declare class BrowserInfo {
    private _isAndroid;
    private _isIOS;
    private store;
    get isAndroid(): boolean;
    get isIOS(): boolean;
    get isMobileDevice(): boolean;
    private normalizeLanguageCode;
    get languageCode(): string;
    set languageCode(lang: string);
}
declare const _default: BrowserInfo;
export default _default;
//# sourceMappingURL=BrowserInfo.d.ts.map