class BrowserInfo {
  private _isAndroid: boolean | undefined;
  private _isIOS: boolean | undefined;

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
}

export default new BrowserInfo();
