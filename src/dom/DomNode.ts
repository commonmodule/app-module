import { EventTreeNode } from "@common-module/ts";

type Tag = "" | keyof HTMLElementTagNameMap;

export type DomSelector =
  | Tag
  | `${Tag}#${string}`
  | `${Tag}.${string}`
  | `${Tag}#${string}.${string}`;

export type ElementOrSelector = HTMLElement | DomSelector;

type InferElementTypeByTag<TT extends Tag | string> = TT extends ""
  ? HTMLDivElement
  : (
    TT extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[TT]
      : HTMLElement
  );

export type InferElementType<EOS extends ElementOrSelector> = EOS extends
  HTMLElement ? EOS
  : (
    EOS extends "" ? HTMLDivElement
      : (
        EOS extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[EOS]
          : (
            EOS extends `${infer TT}#${string}` ? InferElementTypeByTag<TT>
              : (
                EOS extends `${infer TT}.${string}` ? InferElementTypeByTag<TT>
                  : HTMLElement
              )
          )
      )
  );

export type DomChild<EOS extends ElementOrSelector> =
  | DomNode
  | Partial<InferElementType<EOS>>
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
> extends EventTreeNode<
  DomNode,
  ET & { visible: () => void; remove: () => void }
> {
  private removed = false;

  public element: HE;

  constructor(
    elementOrSelector?: HE | DomSelector,
    ...children: DomChild<HE>[]
  ) {
    super();

    this.element = elementOrSelector instanceof HTMLElement
      ? elementOrSelector
      : createElementBySelector(elementOrSelector ?? "") as HE;

    this.append(...children);
  }

  private appendText(text: string): this {
    if (this.element instanceof HTMLTextAreaElement) {
      this.element.value += text;
    } else {
      const fragment = document.createDocumentFragment();
      text.split("\n").forEach((line, index) => {
        if (index > 0) fragment.appendChild(document.createElement("br"));
        fragment.appendChild(document.createTextNode(line));
      });
      this.element.appendChild(fragment);
    }
    return this;
  }

  public append(...children: DomChild<HE>[]) {
    for (const child of children) {
      if (child === undefined) continue;
      else if (child instanceof DomNode) child.appendTo(this);
      else if (typeof child === "string") this.appendText(child);
      else Object.assign(this.element, child);
    }
  }

  private isVisible(): boolean {
    let currentNode: DomNode | undefined = this;
    while (currentNode !== undefined) {
      if (currentNode.element === document.body) {
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
    if (index === undefined || index >= parent.element.childNodes.length) {
      parent.element.appendChild(this.element);
    } else {
      const referenceNode = parent.element.childNodes[index];
      parent.element.insertBefore(this.element, referenceNode);
    }

    super.appendTo(parent, index);

    if (this.isVisible()) this.notifyVisibility();

    return this;
  }

  public remove() {
    if (this.removed) return;
    this.removed = true;

    this.emit(
      "remove",
      ...([] as Parameters<(ET & { remove: () => void })["remove"]>),
    );

    this.element.remove();

    super.remove();
  }

  public empty(): this {
    this.element.innerHTML = "";
    return this;
  }

  public set text(text: string | undefined) {
    this.empty();
    if (text) this.appendText(text);
  }

  public get text(): string {
    return this.element.textContent ?? "";
  }

  public style<T extends Partial<CSSStyleDeclaration> | string>(
    styles: T,
  ): T extends string ? string : this {
    if (typeof styles === "string") {
      return this.element.style.getPropertyValue(styles) as T extends string
        ? string
        : this;
    } else {
      Object.assign(this.element.style, styles);
      return this as T extends string ? string : this;
    }
  }

  public onDom<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HE, event: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): this {
    this.element.addEventListener(type, listener as EventListener, options);
    return this;
  }

  public offDom<K extends keyof HTMLElementEventMap>(
    type: K,
    listener: (this: HE, event: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): this {
    this.element.removeEventListener(type, listener as EventListener, options);
    return this;
  }

  public calculateRect(): DOMRect {
    return this.element.getBoundingClientRect();
  }
}
