import DomNode from "./DomNode.js";

export default class QueriedDomNode extends DomNode {
  constructor(selector: string) {
    super(document.querySelector(selector) as HTMLElement);
  }

  protected isVisible(): boolean {
    return true;
  }
}
