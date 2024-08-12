import { EventContainer } from "@common-module/ts";
import DomUtil from "./DomUtil.js";
export default class DomNode extends EventContainer {
    parent;
    children = [];
    removalDelay;
    removalClassName;
    htmlElement;
    constructor(htmlElement, ...children) {
        super();
        this.htmlElement = htmlElement instanceof HTMLElement
            ? htmlElement
            : DomUtil.createHtmlElement(htmlElement ?? "");
        this.append(...children);
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
    append(...children) {
        for (const child of children) {
            if (child instanceof DomNode) {
                child.appendTo(this);
            }
            else if (typeof child === "string") {
                this.appendText(child);
            }
            else {
                if (child.removalDelay !== undefined) {
                    this.removalDelay = child.removalDelay;
                }
                if (child.removalClassName !== undefined) {
                    this.removalClassName = child.removalClassName;
                }
            }
        }
    }
    isVisible() {
        let currentNode = this;
        while (currentNode !== undefined) {
            if (currentNode.htmlElement === document.body) {
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
        if (index === undefined || index >= parent.htmlElement.childNodes.length) {
            parent.htmlElement.appendChild(this.htmlElement);
        }
        else {
            const referenceNode = parent.htmlElement.childNodes[index];
            parent.htmlElement.insertBefore(this.htmlElement, referenceNode);
        }
        this.parent = parent;
        if (this.isVisible())
            this.notifyVisibility();
        return this;
    }
    remove() {
        if (this.removalClassName) {
            this.htmlElement.classList.add(this.removalClassName);
        }
        if (this.removalDelay === undefined) {
            this.htmlElement.remove();
        }
        else {
            setTimeout(() => {
                this.htmlElement.remove();
            }, this.removalDelay);
        }
    }
    empty() {
        this.htmlElement.innerHTML = "";
        return this;
    }
    set text(text) {
        this.empty();
        if (text)
            this.appendText(text);
    }
    get text() {
        return this.htmlElement.textContent ?? "";
    }
    style(styles) {
        Object.assign(this.htmlElement.style, styles);
        return this;
    }
    onDom(type, listener, options) {
        this.htmlElement.addEventListener(type, listener, options);
        return this;
    }
    calculateRect() {
        return this.htmlElement.getBoundingClientRect();
    }
}
//# sourceMappingURL=DomNode.js.map