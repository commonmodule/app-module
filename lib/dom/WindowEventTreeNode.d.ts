import { EventTreeNode } from "@common-module/ts";
export default class WindowEventTreeNode<TT extends EventTreeNode<TT, ET>, ET extends Record<string, (...args: any[]) => any>> extends EventTreeNode<TT, ET> {
    private listeners;
    onWindow<K extends keyof WindowEventMap>(type: K, listener: (ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
    offWindow<K extends keyof WindowEventMap>(type: K, listener: (ev: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): this;
    remove(): void;
}
//# sourceMappingURL=WindowEventTreeNode.d.ts.map