export default class View {
    eventListeners = new Map();
    container;
    changeData(data) { }
    addViewManagedEvent(target, eventName, listener) {
        if (!this.eventListeners.has(target)) {
            this.eventListeners.set(target, new Map());
        }
        const targetListeners = this.eventListeners.get(target);
        targetListeners.set(eventName, listener);
        target.on(eventName, listener);
        return this;
    }
    removeAllEvents() {
        for (const [target, listeners] of this.eventListeners) {
            for (const [eventName, listener] of listeners) {
                target.off(eventName, listener);
            }
        }
        this.eventListeners.clear();
    }
    close() {
        this.removeAllEvents();
        this.container.remove();
    }
}
//# sourceMappingURL=View.js.map