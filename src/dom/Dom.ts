import { DefaultHandlers, EventHandlers, EventNode } from "@commonmodule/ts";
import {
  DomSelector,
  ElementOrSelector,
  ElementProperties,
  InferElementType,
} from "@commonmodule/universal-page";
import createElementBySelector from "./createElementBySelector.js";

export type ElementEventMap<H extends HTMLElement> = H extends HTMLBodyElement
  ? WindowEventMap & DocumentEventMap & HTMLBodyElementEventMap
  : H extends HTMLVideoElement
    ? HTMLMediaElementEventMap & HTMLVideoElementEventMap
  : H extends HTMLAudioElement ? HTMLMediaElementEventMap
  : HTMLElementEventMap;

type ElementEventHandlers<H extends HTMLElement> = {
  [K in keyof HTMLElementEventMap]: (event: ElementEventMap<H>[K]) => void;
};

export type DomDefaultHandlers = { visible: () => void };

export type AllDomHandlers<H extends HTMLElement, E> =
  & E
  & DefaultHandlers
  & DomDefaultHandlers
  & ElementEventHandlers<H>;

export type DomChild<EOS extends ElementOrSelector = ElementOrSelector> =
  | Dom
  | ElementProperties<InferElementType<EOS>>
  | string
  | undefined;

export default class Dom<
  H extends HTMLElement = HTMLElement,
  E extends EventHandlers = {},
> extends EventNode<Dom, AllDomHandlers<H, E>> {
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
    this.emit("visible");
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

  public override on<K extends keyof E>(eventName: K, eventHandler: E[K]): this;

  public override on<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): this;

  public override on<K extends keyof DomDefaultHandlers>(
    eventName: K,
    eventHandler: DomDefaultHandlers[K],
  ): this;

  public override on<K extends keyof ElementEventMap<H>>(
    eventName: K,
    eventHandler: (event: ElementEventMap<H>[K]) => void,
  ): this;

  public override on<K extends keyof AllDomHandlers<H, E>>(
    eventName: K,
    eventHandler: AllDomHandlers<H, E>[K],
  ): this {
    if (("on" + (eventName as keyof HTMLElementEventMap)) in this.htmlElement) {
      this.htmlElement.addEventListener(
        eventName as keyof HTMLElementEventMap,
        eventHandler,
      );
      return this;
    }

    return super.on(eventName, eventHandler);
  }

  public override off<K extends keyof E>(
    eventName: K,
    eventHandler?: E[K],
  ): this;

  public override off<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler?: DefaultHandlers[K],
  ): this;

  public override off<K extends keyof DomDefaultHandlers>(
    eventName: K,
    eventHandler?: DomDefaultHandlers[K],
  ): this;

  public override off<K extends keyof ElementEventMap<H>>(
    eventName: K,
    eventHandler?: (event: ElementEventMap<H>[K]) => void,
  ): this;

  public override off<K extends keyof AllDomHandlers<H, E>>(
    eventName: K,
    eventHandler?: AllDomHandlers<H, E>[K],
  ): this {
    if (("on" + (eventName as keyof HTMLElementEventMap)) in this.htmlElement) {
      this.htmlElement.removeEventListener(
        eventName as keyof HTMLElementEventMap,
        eventHandler as EventListener,
      );
      return this;
    }

    return super.off(eventName, eventHandler);
  }

  protected async emit<K extends keyof E>(
    eventName: K,
    ...args: Parameters<E[K]>
  ): Promise<ReturnType<E[K]>[]>;

  protected async emit<K extends keyof DefaultHandlers>(
    eventName: K,
    ...args: Parameters<DefaultHandlers[K]>
  ): Promise<ReturnType<DefaultHandlers[K]>[]>;

  protected override emit<K extends keyof DomDefaultHandlers>(
    eventName: K,
    ...args: Parameters<DomDefaultHandlers[K]>
  ): Promise<ReturnType<DomDefaultHandlers[K]>[]>;

  protected override emit<K extends keyof AllDomHandlers<H, E>>(
    eventName: K,
    ...args: Parameters<AllDomHandlers<H, E>[K]>
  ): Promise<ReturnType<AllDomHandlers<H, E>[K]>[]> {
    if (("on" + (eventName as keyof HTMLElementEventMap)) in this.htmlElement) {
      const event = new Event(eventName as string);
      this.htmlElement.dispatchEvent(event);
    }

    return super.emit(eventName, ...args);
  }

  public bind<K extends keyof E>(
    eventName: K,
    eventHandler: E[K],
    target: Dom,
  ): this;

  public bind<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler: DefaultHandlers[K],
    target: Dom,
  ): this;

  public bind<K extends keyof DomDefaultHandlers>(
    eventName: K,
    eventHandler: DomDefaultHandlers[K],
    target: Dom,
  ): this;

  public bind<K extends keyof ElementEventMap<H>>(
    eventName: K,
    eventHandler: (event: ElementEventMap<H>[K]) => void,
    target: Dom,
  ): this;

  public bind<K extends keyof AllDomHandlers<H, E>>(
    eventName: K,
    eventHandler: AllDomHandlers<H, E>[K],
    target: Dom,
  ): this {
    if (
      ("on" + (eventName as keyof HTMLElementEventMap)) in target.htmlElement
    ) {
      target.htmlElement.addEventListener(
        eventName as keyof HTMLElementEventMap,
        eventHandler,
      );
      return this;
    }

    return super.bind(eventName, eventHandler, target);
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
