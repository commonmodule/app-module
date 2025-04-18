import { EventTreeNode } from "@commonmodule/ts";
export default class WindowEventTreeNode extends EventTreeNode {
    listeners = [];
    onWindow(type, listener, options) {
        const boundListener = (event) => {
            listener.call(this, event);
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
    offWindow(type, listener, options) {
        const index = this.listeners.findIndex((l) => l.type === type && l.originalListener === listener);
        if (index !== -1) {
            const { listener: boundListener } = this.listeners[index];
            window.removeEventListener(type, boundListener, options);
            this.listeners.splice(index, 1);
        }
        return this;
    }
    remove() {
        this.listeners.forEach(({ type, listener, options }) => window.removeEventListener(type, listener, options));
        this.listeners = [];
        super.remove();
    }
}
//# sourceMappingURL=WindowEventTreeNode.js.map