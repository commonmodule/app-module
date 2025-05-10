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
    bind(target, eventName, eventHandler) {
        if (("on" + eventName) in window) {
            window.addEventListener(eventName, eventHandler);
            return this;
        }
        if (("on" + eventName) in document) {
            document.addEventListener(eventName, eventHandler);
            return this;
        }
        return super.bind(target, eventName, eventHandler);
    }
}
export default new AppRoot();
//# sourceMappingURL=AppRoot.js.map