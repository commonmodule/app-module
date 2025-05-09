import { DefaultHandlers } from "@commonmodule/ts";
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
}

export default new AppRoot();
