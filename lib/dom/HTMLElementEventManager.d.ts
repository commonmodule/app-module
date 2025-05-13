export default class HTMLElementEventManager<E> {
    private htmlElement;
    private events;
    constructor(htmlElement: {
        addEventListener: (eventName: string, eventHandler: EventListener) => void;
        removeEventListener: (eventName: string, eventHandler: EventListener) => void;
    });
    addEvent<K extends keyof E>(eventName: K, eventHandler: E[K]): void;
    addOnceEvent<K extends keyof E>(eventName: K, eventHandler: E[K]): void;
    hasEvent<K extends keyof E>(eventName: K): boolean;
    removeEvent<K extends keyof E>(eventName: K, eventHandler?: E[K]): void;
    remove(): void;
}
//# sourceMappingURL=HTMLElementEventManager.d.ts.map