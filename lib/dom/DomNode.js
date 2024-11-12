import WindowEventTreeNode from "./WindowEventTreeNode.js";
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
export default class DomNode extends WindowEventTreeNode {
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
            else if (child instanceof DomNode)
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
            else if (child instanceof DomNode)
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
        this.emit("visible", ...[]);
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
        this.htmlElement.innerHTML = "";
        return this;
    }
    remove() {
        if (this.removed)
            return;
        this.emit("remove", ...[]);
        this.htmlElement.remove();
        super.remove();
    }
    set text(text) {
        this.clear();
        if (text)
            this.appendText(text);
    }
    get text() {
        return this.htmlElement.textContent ?? "";
    }
    addClass(...classNames) {
        this.htmlElement.classList.add(...classNames);
        return this;
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
    onDom(type, listener, options) {
        this.htmlElement.addEventListener(type, listener, options);
        return this;
    }
    offDom(type, listener, options) {
        this.htmlElement.removeEventListener(type, listener, options);
        return this;
    }
    calculateRect() {
        return this.htmlElement.getBoundingClientRect();
    }
    clone() {
        return new DomNode(this.htmlElement.cloneNode(true));
    }
}
//# sourceMappingURL=DomNode.js.map