import { EventContainer } from "@common-module/ts";
import DomSelector from "./DomSelector.js";
import DomUtil from "./DomUtil.js";

export type DomChild = DomNode | string;

export default class DomNode<
  HE extends HTMLElement = HTMLElement,
  ET extends Record<string, (...args: any[]) => any> = {},
> extends EventContainer<ET & { visible: () => void }> {
  private parent: DomNode | undefined;
  private children: DomNode[] = [];

  protected htmlElement: HE;

  constructor(htmlElement?: HE | DomSelector, ...children: DomChild[]) {
    super();
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

  public append(...children: DomChild[]) {
    for (const child of children) {
      if (child instanceof DomNode) {
        child.appendTo(this);
      } else if (typeof child === "string") {
        this.appendText(child);
      } else { // attributes
        //TODO:
      }
    }
  }

  private isVisible(): boolean {
    let currentNode: DomNode | undefined = this;
    while (currentNode !== undefined) {
      if (currentNode.htmlElement === document.body) {
        return true;
      }
      currentNode = currentNode.parent;
    }
    return false;
  }

  private notifyVisibility() {
    this.emit(
      "visible",
      ...([] as Parameters<(ET & { visible: () => void })["visible"]>),
    );
    this.children.forEach((child) => child.notifyVisibility());
  }

  public appendTo(parent: DomNode, index?: number): this {
    if (index === undefined || index >= parent.htmlElement.childNodes.length) {
      parent.htmlElement.appendChild(this.htmlElement);
    } else {
      const referenceNode = parent.htmlElement.childNodes[index];
      parent.htmlElement.insertBefore(this.htmlElement, referenceNode);
    }
    this.parent = parent;
    if (this.isVisible()) this.notifyVisibility();
    return this;
  }

  public delete() {
    //TODO:
  }

  public empty(): this {
    this.htmlElement.innerHTML = "";
    return this;
  }

  public set text(text: string | undefined) {
    this.empty();
    if (text) this.appendText(text);
  }

  public get text(): string {
    return this.htmlElement.textContent ?? "";
  }

  public style(styles: Partial<CSSStyleDeclaration>): this {
    Object.assign(this.htmlElement.style, styles);
    return this;
  }
}
