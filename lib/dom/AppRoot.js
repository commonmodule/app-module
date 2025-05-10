import Dom from "./Dom.js";
class AppRoot extends Dom {
    constructor() {
        super(document.body);
    }
    on(eventName, handler) {
        if (("on" + eventName) in window) {
            window.addEventListener(eventName, handler);
            return this;
        }
        if (("on" + eventName) in document) {
            document.addEventListener(eventName, handler);
            return this;
        }
        return super.on(eventName, handler);
    }
    off(eventName, eventHandler) {
        if (("on" + eventName) in window) {
            window.removeEventListener(eventName, eventHandler);
            return this;
        }
        if (("on" + eventName) in document) {
            document.removeEventListener(eventName, eventHandler);
            return this;
        }
        return super.off(eventName, eventHandler);
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
}
export default new AppRoot();
//# sourceMappingURL=AppRoot.js.map