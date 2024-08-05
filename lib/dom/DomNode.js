import DomUtil from "./DomUtil.js";
export default class DomNode {
    htmlElement;
    constructor(htmlElement, ...children) {
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
            }
        }
    }
    appendTo(parent, index) {
        if (index === undefined || index >= parent.htmlElement.childNodes.length) {
            parent.htmlElement.appendChild(this.htmlElement);
        }
        else {
            const referenceNode = parent.htmlElement.childNodes[index];
            parent.htmlElement.insertBefore(this.htmlElement, referenceNode);
        }
        return this;
    }
    delete() {
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
}
//# sourceMappingURL=DomNode.js.map