import { EventContainer, EventHandlers } from "@commonmodule/ts";
import Dom from "../dom/Dom.js";

export default abstract class View<DT = {}, CT extends Dom = Dom> {
  private eventListeners: Map<
    EventContainer<EventHandlers>,
    Map<string, (...args: any[]) => any>
  > = new Map();

  protected container!: CT;

  public changeData(data: DT): void {}

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
    this.container?.remove();
  }
}
