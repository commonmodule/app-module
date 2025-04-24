import { EventRecord, EventTreeNode } from "@commonmodule/ts";

export default class WindowEventTreeNode<
  T extends EventTreeNode<T, E>,
  E extends EventRecord,
> extends EventTreeNode<T, E> {
  private listeners: Array<{
    type: keyof WindowEventMap;
    listener: EventListener;
    options?: boolean | AddEventListenerOptions | EventListenerOptions;
    originalListener: Function;
  }> = [];

  public onWindow<K extends keyof WindowEventMap>(
    type: K,
    listener: (ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): this {
    const boundListener: EventListener = (event: Event) => {
      listener.call(this, event as WindowEventMap[K]);
    };
    window.addEventListener(type, boundListener, options);
    this.listeners.push({
      type,
      listener: boundListener,
      options,
      originalListener: listener,
    });
    return this;
  }

  public offWindow<K extends keyof WindowEventMap>(
    type: K,
    listener: (ev: WindowEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): this {
    const index = this.listeners.findIndex(
      (l) => l.type === type && l.originalListener === listener,
    );
    if (index !== -1) {
      const { listener: boundListener } = this.listeners[index];
      window.removeEventListener(type, boundListener, options);
      this.listeners.splice(index, 1);
    }
    return this;
  }

  public remove(): void {
    this.listeners.forEach(({ type, listener, options }) =>
      window.removeEventListener(type, listener, options)
    );
    this.listeners = [];

    super.remove();
  }
}
