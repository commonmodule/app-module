export default class HTMLElementEventManager {
    htmlElement;
    events = {};
    constructor(htmlElement) {
        this.htmlElement = htmlElement;
    }
    addEvent(eventName, eventHandler) {
        if (!this.events[eventName])
            this.events[eventName] = [];
        this.events[eventName].push({
            eventHandler,
            eventHandlerWrapper: eventHandler,
        });
        this.htmlElement.addEventListener(eventName, eventHandler);
    }
    addOnceEvent(eventName, eventHandler) {
        if (!this.events[eventName])
            this.events[eventName] = [];
        const eventHandlerWrapper = ((...args) => {
            const result = eventHandler(...args);
            this.removeEvent(eventName, eventHandler);
            return result;
        });
        this.events[eventName].push({
            eventHandler,
            eventHandlerWrapper,
        });
        this.htmlElement.addEventListener(eventName, eventHandlerWrapper);
    }
    hasEvent(eventName) {
        const events = this.events[eventName];
        if (!events)
            return false;
        return events.length > 0;
    }
    removeEvent(eventName, eventHandler) {
        const events = this.events[eventName];
        const eventHandlerWrappers = [];
        if (!events)
            return;
        if (!eventHandler) {
            for (const { eventHandlerWrapper } of events) {
                eventHandlerWrappers.push(eventHandlerWrapper);
            }
            delete this.events[eventName];
        }
        else {
            const index = events.findIndex((h) => h.eventHandler === eventHandler);
            if (index !== -1) {
                const { eventHandlerWrapper } = events[index];
                eventHandlerWrappers.push(eventHandlerWrapper);
                events.splice(index, 1);
            }
            if (events.length === 0)
                delete this.events[eventName];
        }
        for (const eventHandlerWrapper of eventHandlerWrappers) {
            this.htmlElement.removeEventListener(eventName, eventHandlerWrapper);
        }
    }
    remove() {
        if (!this.events)
            throw new Error("This manager is already removed");
        for (const eventName in Object.keys(this.events)) {
            const events = this.events[eventName];
            if (events) {
                for (const { eventHandlerWrapper } of events) {
                    this.htmlElement.removeEventListener(eventName, eventHandlerWrapper);
                }
            }
        }
        delete this.events;
    }
}
//# sourceMappingURL=HTMLElementEventManager.js.map