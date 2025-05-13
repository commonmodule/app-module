import { EventContainer, EventHandlers } from "@commonmodule/ts";
import Dom from "../dom/Dom.js";

export default abstract class View<Data = {}, Container extends Dom = Dom> {
  private eventListeners: Map<
    EventContainer<EventHandlers>,
    Map<string, (...args: any[]) => any>
  > = new Map();

  protected container!: Container;

  public changeData(data: Data): void {}

  protected addViewManagedEvent<
    T extends EventContainer<E>,
    E extends EventHandlers,
    K extends keyof E,
  >(
    target: T,
    eventName: K,
    listener: (E & { visible: () => void; remove: () => void })[K],
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
    if (this.container && this.container.isRemoved() !== true) {
      this.container.remove();
    }
  }
}
