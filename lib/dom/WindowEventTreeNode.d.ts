import { EventTreeNode } from "@commonmodule/ts";
export default class WindowEventTreeNode<T extends EventTreeNode<T, E>, E extends Record<string, (...args: any[]) => any>> extends EventTreeNode<T, E> {
    private listeners;
    onWindow<K extends keyof WindowEventMap>(type: K, listener: (ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
    offWindow<K extends keyof WindowEventMap>(type: K, listener: (ev: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): this;
    remove(): void;
}
//# sourceMappingURL=WindowEventTreeNode.d.ts.map