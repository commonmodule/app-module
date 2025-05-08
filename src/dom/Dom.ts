import { DefaultHandlers, EventNode } from "@commonmodule/ts";
import {
  DomSelector,
  ElementOrSelector,
  ElementProperties,
  InferElementType,
} from "@commonmodule/universal-page";
import createElementBySelector from "./createElementBySelector.js";

type ElementEventMap<H extends HTMLElement> = H extends HTMLVideoElement
  ? HTMLMediaElementEventMap & HTMLVideoElementEventMap
  : H extends HTMLAudioElement ? HTMLMediaElementEventMap
  : HTMLElementEventMap;
type ElementEventHandlers<H extends HTMLElement> = {
  [K in keyof HTMLElementEventMap]: (event: ElementEventMap<H>[K]) => void;
};

type DomDefaultHandlers = { visible: () => void };
export type DomHandlers<E, H extends HTMLElement> = Omit<
  E,
  keyof DomDefaultHandlers | keyof ElementEventHandlers<H>
>;
type WithDomDefaultHandlers<E> = E & DomDefaultHandlers;
type WithAllHandlers<H extends HTMLElement, E> =
  & WithDomDefaultHandlers<E>
  & ElementEventHandlers<H>
  & DefaultHandlers;

export type DomChild<EOS extends ElementOrSelector = ElementOrSelector> =
  | Dom
  | ElementProperties<InferElementType<EOS>>
  | string
  | undefined;

export default class Dom<
  H extends HTMLElement = HTMLElement,
  E extends DomHandlers<E, H> = {},
> extends EventNode<Dom, WithDomDefaultHandlers<E>> {
  public htmlElement: H;

  constructor(
    elementOrSelector?: H | DomSelector,
    ...children: DomChild<H>[]
  ) {
    super();

    this.htmlElement = elementOrSelector instanceof Element
      ? elementOrSelector
      : createElementBySelector(elementOrSelector ?? "") as H;

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

  public prepend(...children: DomChild<H>[]): this {
    for (const child of children) {
      if (child === undefined) continue;
      else if (child instanceof Dom) child.appendTo(this, 0);
      else if (typeof child === "string") this.prependText(child);
      else {
        Object.assign(this.htmlElement, child);
        if (child.style) this.style(child.style);
      }
    }
    return this;
  }

  public append(...children: DomChild<H>[]): this {
    for (const child of children) {
      if (child === undefined) continue;
      else if (child instanceof Dom) child.appendTo(this);
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
      ...([] as Parameters<(E & { visible: () => void })["visible"]>),
    );

    this.children.forEach((child) => child.notifyVisibility());
  }

  public appendTo(parent: Dom, index?: number): this {
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

  public clear(...except: (Dom | undefined)[]) {
    super.clear(...except);
    if (this.children.length === 0) this.htmlElement.innerHTML = "";
    return this;
  }

  public set text(text: string | undefined) {
    this.clear();
    if (text) this.appendText(text);
  }

  public get text(): string {
    return this.htmlElement.textContent ?? "";
  }

  public override on<K extends keyof WithAllHandlers<H, E>>(
    eventName: K,
    handler: WithAllHandlers<H, E>[K],
  ): this {
    if (("on" + (eventName as keyof HTMLElementEventMap)) in this.htmlElement) {
      this.htmlElement.addEventListener(
        eventName as keyof HTMLElementEventMap,
        handler as EventListener,
      );
    }
    return super.on(eventName, handler);
  }

  public addClass(...classNames: string[]): this {
    this.htmlElement.classList.add(...classNames);
    return this;
  }

  public hasClass(className: string): boolean {
    return this.htmlElement.classList.contains(className);
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

  public calculateRect(): DOMRect {
    return this.htmlElement.getBoundingClientRect();
  }

  public clone(): Dom<H, E> {
    return new Dom<H, E>(this.htmlElement.cloneNode(true) as H);
  }

  public remove() {
    if (this.isRemoved()) throw new Error("Dom already removed");
    this.htmlElement.remove();
    super.remove();
  }
}
