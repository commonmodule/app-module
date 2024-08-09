class BrowserInfo {
    _isAndroid;
    _isIOS;
    get isAndroid() {
        return this._isAndroid ??
            (this._isAndroid = /Android/i.test(navigator.userAgent));
    }
    get isIOS() {
        return this._isIOS ??
            (this._isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
    get isMobileDevice() {
        return this.isAndroid || this.isIOS;
    }
}
export default new BrowserInfo();
//# sourceMappingURL=BrowserInfo.js.map