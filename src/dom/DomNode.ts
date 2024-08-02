import DomSelector from "./DomSelector.js";
import DomUtil from "./DomUtil.js";

export type DomChild = DomNode;

export default class DomNode<HE extends HTMLElement = HTMLElement> {
  private htmlElement: HE;

  constructor(htmlElement?: HE | DomSelector, ...children: DomChild[]) {
    this.htmlElement = htmlElement instanceof HTMLElement
      ? htmlElement
      : DomUtil.createHtmlElement<HE>(htmlElement ?? "");
    this.append(...children);
  }

  private appendText(text: string): this {
    if (this.htmlElement instanceof HTMLTextAreaElement) {
      this.htmlElement.value += text;
    } else {
      const fragment = document.createDocumentFragment();
      text.split("\n").forEach((line, index) => {
        if (index > 0) fragment.appendChild(document.createElement("br"));
        fragment.appendChild(document.createTextNode(line));
      });
      this.htmlElement.appendChild(fragment);
    }
    return this;
  }

  private append(...children: DomChild[]) {
    //TODO:
  }

  public style(styles: Partial<CSSStyleDeclaration>): this {
    Object.assign(this.htmlElement.style, styles);
    return this;
  }

  public delete() {
    //TODO:
  }
}
