import { EventNode } from "@commonmodule/ts";
import createElementBySelector from "./createElementBySelector.js";
export default class Dom extends EventNode {
    htmlElement;
    constructor(elementOrSelector, ...children) {
        super();
        this.htmlElement = elementOrSelector instanceof Element
            ? elementOrSelector
            : createElementBySelector(elementOrSelector ?? "");
        this.append(...children);
    }
    prependText(text) {
        if (this.htmlElement instanceof HTMLTextAreaElement) {
            this.htmlElement.value = text + this.htmlElement.value;
        }
        else {
            const fragment = document.createDocumentFragment();
            text.split("\n").forEach((line, index) => {
                if (index > 0)
                    fragment.appendChild(document.createElement("br"));
                fragment.appendChild(document.createTextNode(line));
            });
            this.htmlElement.prepend(fragment);
        }
        return this;
    }
    appendText(text) {
        if (this.htmlElement instanceof HTMLTextAreaElement) {
            this.htmlElement.value += text;
        }
        else {
            const fragment = document.createDocumentFragment();
            text.split("\n").forEach((line, index) => {
                if (index > 0)
                    fragment.appendChild(document.createElement("br"));
                fragment.appendChild(document.createTextNode(line));
            });
            this.htmlElement.appendChild(fragment);
        }
        return this;
    }
    prepend(...children) {
        for (const child of children) {
            if (child === undefined)
                continue;
            else if (child instanceof Dom)
                child.appendTo(this, 0);
            else if (typeof child === "string")
                this.prependText(child);
            else {
                Object.assign(this.htmlElement, child);
                if (child.style)
                    this.style(child.style);
            }
        }
        return this;
    }
    append(...children) {
        for (const child of children) {
            if (child === undefined)
                continue;
            else if (child instanceof Dom)
                child.appendTo(this);
            else if (typeof child === "string")
                this.appendText(child);
            else {
                Object.assign(this.htmlElement, child);
                if (child.style)
                    this.style(child.style);
            }
        }
        return this;
    }
    isVisible() {
        if (this.parent) {
            return this.parent.isVisible() ||
                this.parent.htmlElement === document.body;
        }
        return false;
    }
    notifyVisibility() {
        this.emit("visible");
        this.children.forEach((child) => child.notifyVisibility());
    }
    appendTo(parent, index) {
        if (index === undefined || index >= parent.htmlElement.childNodes.length) {
            parent.htmlElement.appendChild(this.htmlElement);
        }
        else {
            const referenceNode = parent.htmlElement.childNodes[index];
            parent.htmlElement.insertBefore(this.htmlElement, referenceNode);
        }
        super.appendTo(parent, index);
        if (this.isVisible())
            this.notifyVisibility();
        return this;
    }
    clear(...except) {
        super.clear(...except);
        if (this.children.length === 0)
            this.htmlElement.innerHTML = "";
        return this;
    }
    set text(text) {
        this.clear();
        if (text)
            this.appendText(text);
    }
    get text() {
        return this.htmlElement.textContent ?? "";
    }
    on(eventName, eventHandler) {
        if (("on" + eventName) in this.htmlElement) {
            this.htmlElement.addEventListener(eventName, eventHandler);
            return this;
        }
        return super.on(eventName, eventHandler);
    }
    off(eventName, eventHandler) {
        if (("on" + eventName) in this.htmlElement) {
            this.htmlElement.removeEventListener(eventName, eventHandler);
            return this;
        }
        return super.off(eventName, eventHandler);
    }
    emit(eventName, ...args) {
        if (("on" + eventName) in this.htmlElement) {
            const event = new Event(eventName);
            this.htmlElement.dispatchEvent(event);
        }
        return super.emit(eventName, ...args);
    }
    bind(eventName, eventHandler, target) {
        if (("on" + eventName) in target.htmlElement) {
            target.htmlElement.addEventListener(eventName, eventHandler);
            return this;
        }
        return super.bind(eventName, eventHandler, target);
    }
    addClass(...classNames) {
        this.htmlElement.classList.add(...classNames);
        return this;
    }
    hasClass(className) {
        return this.htmlElement.classList.contains(className);
    }
    removeClass(...classNames) {
        this.htmlElement.classList.remove(...classNames);
        return this;
    }
    style(styles) {
        if (typeof styles === "string") {
            return this.htmlElement.style.getPropertyValue(styles);
        }
        else {
            Object.assign(this.htmlElement.style, styles);
            return this;
        }
    }
    calculateRect() {
        return this.htmlElement.getBoundingClientRect();
    }
    clone() {
        return new Dom(this.htmlElement.cloneNode(true));
    }
    remove() {
        if (this.isRemoved())
            throw new Error("Dom already removed");
        this.htmlElement.remove();
        super.remove();
    }
}
//# sourceMappingURL=Dom.js.map