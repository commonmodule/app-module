import {
  DomSelector,
  ElementOrSelector,
  ElementProperties,
  InferElementType,
} from "@common-module/universal-page";
import WindowEventTreeNode from "./WindowEventTreeNode.js";

export type DomChild<EOS extends ElementOrSelector = ElementOrSelector> =
  | DomNode
  | ElementProperties<InferElementType<EOS>>
  | string
  | undefined;

function createElementBySelector<S extends DomSelector>(
  selector: S,
): InferElementType<S> {
  const parts = (selector || "div").split(/([#.])/);
  const tagName = parts[0] || "div";
  const element = document.createElement(tagName) as InferElementType<S>;

  let currentType: "#" | "." | "" = "";
  for (let i = 1; i < parts.length; i += 2) {
    currentType = parts[i] as "#" | ".";
    const value = parts[i + 1];
    if (currentType === "#") element.id = value;
    else if (currentType === ".") element.classList.add(value);
  }

  return element;
}

export default class DomNode<
  HE extends HTMLElement = HTMLElement,
  ET extends Record<string, (...args: any[]) => any> = {},
> extends WindowEventTreeNode<
  DomNode,
  ET & { visible: () => void; remove: () => void }
> {
  public htmlElement: HE;

  constructor(
    elementOrSelector?: HE | DomSelector,
    ...children: DomChild<HE>[]
  ) {
    super();

    this.htmlElement = elementOrSelector instanceof Element
      ? elementOrSelector
      : createElementBySelector(elementOrSelector ?? "") as HE;

    this.append(...children);
  }

  private prependText(text: string): this {
    if (this.htmlElement instanceof HTMLTextAreaElement) {
      this.htmlElement.value = text + this.htmlElement.value;
    } else {
      const fragment = document.createDocumentFragment();
      text.split("\n").forEach((line, index) => {
        if (index > 0) fragment.appendChild(document.createElement("br"));
        fragment.appendChild(document.createTextNode(line));
      });
      this.htmlElement.prepend(fragment);
    }
    return this;
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

  public prepend(...children: DomChild<HE>[]): this {
    for (const child of children) {
      if (child === undefined) continue;
      else if (child instanceof DomNode) child.appendTo(this, 0);
      else if (typeof child === "string") this.prependText(child);
      else {
        Object.assign(this.htmlElement, child);
        if (child.style) this.style(child.style);
      }
    }
    return this;
  }

  public append(...children: DomChild<HE>[]): this {
    for (const child of children) {
      if (child === undefined) continue;
      else if (child instanceof DomNode) child.appendTo(this);
      else if (typeof child === "string") this.appendText(child);
      else {
        Object.assign(this.htmlElement, child);
        if (child.style) this.style(child.style);
      }
    }
    return this;
  }

  protected isVisible(): boolean {
    if (this.parent) {
      return this.parent.isVisible() ||
        this.parent.htmlElement === document.body;
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

    super.appendTo(parent, index);

    if (this.isVisible()) this.notifyVisibility();

    return this;
  }

  public remove() {
    if (this.removed) return;

    this.emit(
      "remove",
      ...([] as Parameters<(ET & { remove: () => void })["remove"]>),
    );

    this.htmlElement.remove();

    super.remove();
  }

  public set text(text: string | undefined) {
    this.empty();
    if (text) this.appendText(text);
  }

  public get text(): string {
    return this.htmlElement.textContent ?? "";
  }

  public addClass(...classNames: string[]): this {
    this.htmlElement.classList.add(...classNames);
    return this;
  }

  public removeClass(...classNames: string[]): this {
    this.htmlElement.classList.remove(...classNames);
    return this;
  }

  public style<T extends Partial<CSSStyleDeclaration> | string>(
    styles: T,
  ): T extends string ? string : this {
    if (typeof styles === "string") {
      return this.htmlElement.style.getPropertyValue(styles) as T extends string
        ? string
        : this;
    } else {
      Object.assign(this.htmlElement.style, styles);
      return this as T extends string ? string : this;
    }
  }

  public onDom<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HE, event: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): this {
    this.htmlElement.addEventListener(type, listener as EventListener, options);
    return this;
  }

  public offDom<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HE, event: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): this {
    this.htmlElement.removeEventListener(
      type,
      listener as EventListener,
      options,
    );
    return this;
  }

  public calculateRect(): DOMRect {
    return this.htmlElement.getBoundingClientRect();
  }

  public clone(): DomNode<HE, ET> {
    return new DomNode<HE, ET>(this.htmlElement.cloneNode(true) as HE);
  }
}
