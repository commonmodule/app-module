import { EventContainer } from "@common-module/ts";
import DomNode from "../dom/DomNode.js";

export interface ViewParams {
  [name: string]: string | undefined;
}

export default abstract class View<CT extends DomNode = DomNode> {
  private eventListeners: Map<EventContainer<any>, Map<string, EventListener>> =
    new Map();

  protected container!: CT;

  public changeParams(params: ViewParams): void {}

  protected addEvent<
    T extends EventContainer<ET>,
    ET extends Record<string, (...args: any[]) => any>,
    K extends keyof ET,
  >(
    target: T,
    eventName: K,
    listener: (ET & { visible: () => void; remove: () => void })[K],
  ): this {
    if (!this.eventListeners.has(target)) {
      this.eventListeners.set(target, new Map());
    }

    const targetListeners = this.eventListeners.get(target)!;
    targetListeners.set(eventName as string, listener);
    target.on(eventName, listener);

    return this;
  }

  private removeAllEvents(): void {
    for (const [target, listeners] of this.eventListeners) {
      for (const [eventName, listener] of listeners) {
        target.off(eventName, listener);
      }
    }
    this.eventListeners.clear();
  }

  public close(): void {
    this.removeAllEvents();
    this.container.remove();
  }
}
