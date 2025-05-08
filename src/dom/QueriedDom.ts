import Dom from "./Dom.js";

export default class QueriedDom extends Dom {
  constructor(selector: string) {
    super(document.querySelector(selector) as HTMLElement);
  }

  protected isVisible(): boolean {
    return true;
  }
}
