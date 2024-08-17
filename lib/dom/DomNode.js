import { EventContainer } from "@common-module/ts";
function createElementBySelector(selector) {
    const parts = (selector || "div").split(/([#.])/);
    const tagName = parts[0] || "div";
    const element = document.createElement(tagName);
    let currentType = "";
    for (let i = 1; i < parts.length; i += 2) {
        currentType = parts[i];
        const value = parts[i + 1];
        if (currentType === "#")
            element.id = value;
        else if (currentType === ".")
            element.classList.add(value);
    }
    return element;
}
export default class DomNode extends EventContainer {
    parent;
    children = [];
    element;
    removalDelay;
    removalClassName;
    removed = false;
    constructor(elementOrSelector, ...children) {
        super();
        this.element = elementOrSelector instanceof HTMLElement
            ? elementOrSelector
            : createElementBySelector(elementOrSelector ?? "");
        this.append(...children);
    }
    appendText(text) {
        if (this.element instanceof HTMLTextAreaElement) {
            this.element.value += text;
        }
        else {
            const fragment = document.createDocumentFragment();
            text.split("\n").forEach((line, index) => {
                if (index > 0)
                    fragment.appendChild(document.createElement("br"));
                fragment.appendChild(document.createTextNode(line));
            });
            this.element.appendChild(fragment);
        }
        return this;
    }
    append(...children) {
        for (const child of children) {
            if (child === undefined)
                continue;
            else if (child instanceof DomNode)
                child.appendTo(this);
            else if (typeof child === "string")
                this.appendText(child);
            else {
                if (child.removalDelay !== undefined) {
                    this.removalDelay = child.removalDelay;
                }
                if (child.removalClassName !== undefined) {
                    this.removalClassName = child.removalClassName;
                }
                Object.assign(this.element, child);
            }
        }
    }
    isVisible() {
        let currentNode = this;
        while (currentNode !== undefined) {
            if (currentNode.element === document.body) {
                return true;
            }
            currentNode = currentNode.parent;
        }
        return false;
    }
    notifyVisibility() {
        this.emit("visible", ...[]);
        this.children.forEach((child) => child.notifyVisibility());
    }
    appendTo(parent, index) {
        if (index === undefined || index >= parent.element.childNodes.length) {
            parent.element.appendChild(this.element);
        }
        else {
            const referenceNode = parent.element.childNodes[index];
            parent.element.insertBefore(this.element, referenceNode);
        }
        this.parent = parent;
        if (this.isVisible())
            this.notifyVisibility();
        return this;
    }
    remove() {
        if (this.removed)
            return;
        this.removed = true;
        this.emit("remove", ...[]);
        if (this.removalClassName) {
            this.element.classList.add(this.removalClassName);
        }
        if (this.removalDelay === undefined) {
            this.element.remove();
        }
        else {
            setTimeout(() => this.element.remove(), this.removalDelay);
        }
    }
    empty() {
        this.element.innerHTML = "";
        return this;
    }
    set text(text) {
        this.empty();
        if (text)
            this.appendText(text);
    }
    get text() {
        return this.element.textContent ?? "";
    }
    style(styles) {
        Object.assign(this.element.style, styles);
        return this;
    }
    onDom(type, listener, options) {
        this.element.addEventListener(type, listener, options);
        return this;
    }
    calculateRect() {
        return this.element.getBoundingClientRect();
    }
}
//# sourceMappingURL=DomNode.js.map