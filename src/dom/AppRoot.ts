import { DefaultHandlers, IEventContainer } from "@commonmodule/ts";
import Dom, {
  AllDomHandlers,
  DomDefaultHandlers,
  ElementEventMap,
} from "./Dom.js";

class AppRoot extends Dom<HTMLBodyElement> {
  constructor() {
    super(document.body as HTMLBodyElement);
  }

  public override on<K extends keyof {}>(
    eventName: K,
    eventHandler: {}[K],
  ): this;

  public override on<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): this;

  public override on<K extends keyof DomDefaultHandlers>(
    eventName: K,
    eventHandler: DomDefaultHandlers[K],
  ): this;

  public override on<K extends keyof ElementEventMap<HTMLBodyElement>>(
    eventName: K,
    eventHandler: (event: ElementEventMap<HTMLBodyElement>[K]) => void,
  ): this;

  public override on<K extends keyof AllDomHandlers<HTMLBodyElement, {}>>(
    eventName: K,
    handler: AllDomHandlers<HTMLBodyElement, {}>[K],
  ): this {
    if (("on" + eventName) in window) {
      window.addEventListener(eventName, handler as EventListener);
      return this;
    }

    if (("on" + eventName) in document) {
      document.addEventListener(eventName, handler as EventListener);
      return this;
    }

    return super.on(eventName as any, handler);
  }

  public override off<K extends keyof {}>(
    eventName: K,
    eventHandler?: {}[K],
  ): this;

  public override off<K extends keyof DefaultHandlers>(
    eventName: K,
    eventHandler?: DefaultHandlers[K],
  ): this;

  public override off<K extends keyof DomDefaultHandlers>(
    eventName: K,
    eventHandler?: DomDefaultHandlers[K],
  ): this;

  public override off<K extends keyof ElementEventMap<HTMLBodyElement>>(
    eventName: K,
    eventHandler?: (event: ElementEventMap<HTMLBodyElement>[K]) => void,
  ): this;

  public override off<K extends keyof AllDomHandlers<HTMLBodyElement, {}>>(
    eventName: K,
    eventHandler?: AllDomHandlers<HTMLBodyElement, {}>[K],
  ): this {
    if (("on" + eventName) in window) {
      window.removeEventListener(eventName, eventHandler as EventListener);
      return this;
    }

    if (("on" + eventName) in document) {
      document.removeEventListener(eventName, eventHandler as EventListener);
      return this;
    }

    return super.off(eventName as any, eventHandler);
  }

  public override emit<K extends keyof {}>(
    eventName: K,
    ...args: Parameters<{}[K]>
  ): Promise<ReturnType<{}[K]>[]>;

  public override emit<K extends keyof DefaultHandlers>(
    eventName: K,
    ...args: Parameters<DefaultHandlers[K]>
  ): Promise<ReturnType<DefaultHandlers[K]>[]>;

  public override emit<K extends keyof DomDefaultHandlers>(
    eventName: K,
    ...args: Parameters<DomDefaultHandlers[K]>
  ): Promise<ReturnType<DomDefaultHandlers[K]>[]>;

  public override emit<K extends keyof ElementEventMap<HTMLBodyElement>>(
    eventName: K,
    ...args: Parameters<(event: ElementEventMap<HTMLBodyElement>[K]) => void>
  ): Promise<
    ReturnType<(event: ElementEventMap<HTMLBodyElement>[K]) => void>[]
  >;

  public override emit<K extends keyof AllDomHandlers<HTMLBodyElement, {}>>(
    eventName: K,
    ...args: Parameters<AllDomHandlers<HTMLBodyElement, {}>[K]>
  ): Promise<ReturnType<AllDomHandlers<HTMLBodyElement, {}>[K]>[]> {
    if (("on" + eventName) in window) {
      const event = new Event(eventName);
      window.dispatchEvent(event);
      return Promise.resolve([]);
    }

    if (("on" + eventName) in document) {
      const event = new Event(eventName);
      document.dispatchEvent(event);
      return Promise.resolve([]);
    }

    return super.emit(eventName as any, ...args);
  }

  public override bind<K extends keyof {}>(
    eventName: K,
    eventHandler: {}[K],
    target: IEventContainer,
  ): this;

  public override bind<K extends keyof DefaultHandlers>(
    target: IEventContainer,
    eventName: K,
    eventHandler: DefaultHandlers[K],
  ): this;

  public override bind<K extends keyof DomDefaultHandlers>(
    target: IEventContainer,
    eventName: K,
    eventHandler: DomDefaultHandlers[K],
  ): this;

  public override bind<K extends keyof ElementEventMap<HTMLBodyElement>>(
    target: IEventContainer,
    eventName: K,
    eventHandler: (event: ElementEventMap<HTMLBodyElement>[K]) => void,
  ): this;

  public override bind<K extends keyof AllDomHandlers<HTMLBodyElement, {}>>(
    target: IEventContainer,
    eventName: K,
    eventHandler: AllDomHandlers<HTMLBodyElement, {}>[K],
  ): this {
    return super.bind(target, eventName as any, eventHandler);
  }
}

export default new AppRoot();
