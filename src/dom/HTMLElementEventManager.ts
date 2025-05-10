export default class HTMLElementEventManager<E> {
  private events: {
    [K in keyof E]?: { eventHandler: E[K]; eventHandlerWrapper: E[K] }[];
  } = {};

  constructor(
    private htmlElement: {
      addEventListener: (
        eventName: string,
        eventHandler: EventListener,
      ) => void;
      removeEventListener: (
        eventName: string,
        eventHandler: EventListener,
      ) => void;
    },
  ) {}

  public addEvent<K extends keyof E>(eventName: K, eventHandler: E[K]) {
    if (!this.events[eventName]) this.events[eventName] = [];
    this.events[eventName].push({
      eventHandler,
      eventHandlerWrapper: eventHandler,
    });

    this.htmlElement.addEventListener(
      eventName as string,
      eventHandler as EventListener,
    );
  }

  public addOnceEvent<K extends keyof E>(
    eventName: K,
    eventHandler: E[K],
  ) {
    if (!this.events[eventName]) this.events[eventName] = [];

    const eventHandlerWrapper = ((...args: any[]) => {
      const result = (eventHandler as any)(...args);
      this.removeEvent(eventName, eventHandler);
      return result;
    }) as E[K];

    this.events[eventName].push({
      eventHandler,
      eventHandlerWrapper,
    });

    this.htmlElement.addEventListener(
      eventName as string,
      eventHandlerWrapper as EventListener,
    );
  }

  public removeEvent<K extends keyof E>(
    eventName: K,
    eventHandler?: E[K],
  ) {
    const events = this.events[eventName];
    const eventHandlerWrappers: E[K][] = [];

    if (!events) return;
    if (!eventHandler) {
      for (const { eventHandlerWrapper } of events) {
        eventHandlerWrappers.push(eventHandlerWrapper);
      }
      delete this.events[eventName];
    } else {
      const index = events.findIndex((h) => h.eventHandler === eventHandler);
      if (index !== -1) {
        const { eventHandlerWrapper } = events[index];
        eventHandlerWrappers.push(eventHandlerWrapper);
        events.splice(index, 1);
      }
      if (events.length === 0) delete this.events[eventName];
    }

    for (const eventHandlerWrapper of eventHandlerWrappers) {
      this.htmlElement.removeEventListener(
        eventName as string,
        eventHandlerWrapper as EventListener,
      );
    }
  }

  public remove() {
    if (!this.events) throw new Error("This manager is already removed");

    for (const eventName in Object.keys(this.events)) {
      const events = this.events[eventName as keyof E];
      if (events) {
        for (const { eventHandlerWrapper } of events) {
          this.htmlElement.removeEventListener(
            eventName,
            eventHandlerWrapper as EventListener,
          );
        }
      }
    }

    delete (this as any).events;
  }
}
