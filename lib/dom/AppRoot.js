import Dom from "./Dom.js";
import HTMLElementEventManager from "./HTMLElementEventManager.js";
class AppRoot extends Dom {
    windowEventManager = new HTMLElementEventManager(window);
    documentEventListeners = new HTMLElementEventManager(document);
    constructor() {
        super(document.body);
    }
    on(eventName, eventHandler) {
        if (("on" + eventName) in window) {
            this.windowEventManager.addEvent(eventName, eventHandler);
            return this;
        }
        if (("on" + eventName) in document) {
            this.documentEventListeners.addEvent(eventName, eventHandler);
            return this;
        }
        return super.on(eventName, eventHandler);
    }
    once(eventName, eventHandler) {
        if (("on" + eventName) in window) {
            this.windowEventManager.addOnceEvent(eventName, eventHandler);
            return this;
        }
        if (("on" + eventName) in document) {
            this.documentEventListeners.addOnceEvent(eventName, eventHandler);
            return this;
        }
        return super.once(eventName, eventHandler);
    }
    off(eventName, eventHandler) {
        if (("on" + eventName) in window) {
            this.windowEventManager.removeEvent(eventName, eventHandler);
            return this;
        }
        if (("on" + eventName) in document) {
            this.documentEventListeners.removeEvent(eventName, eventHandler);
            return this;
        }
        return super.off(eventName, eventHandler);
    }
    hasEvent(eventName) {
        if (("on" + eventName) in window) {
            return this.windowEventManager.hasEvent(eventName);
        }
        if (("on" + eventName) in document) {
            return this.documentEventListeners.hasEvent(eventName);
        }
        return super.hasEvent(eventName);
    }
    emit(eventName, ...args) {
        if (("on" + eventName) in window) {
            const event = new Event(eventName);
            window.dispatchEvent(event);
            return Promise.resolve([]);
        }
        if (("on" + eventName) in document) {
            const event = new Event(eventName);
            document.dispatchEvent(event);
            return Promise.resolve([]);
        }
        return super.emit(eventName, ...args);
    }
    bind(target, eventName, eventHandler) {
        return super.bind(target, eventName, eventHandler);
    }
    remove() {
        this.windowEventManager.remove();
        this.documentEventListeners.remove();
        delete this.windowEventManager;
        delete this.documentEventListeners;
        super.remove();
    }
}
export default new AppRoot();
//# sourceMappingURL=AppRoot.js.map