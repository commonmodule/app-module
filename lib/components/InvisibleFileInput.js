import DomNode from "../dom/DomNode.js";
export default class InvisibleFileInput extends DomNode {
    constructor(options) {
        super("input.invisible-file-input", {
            type: "file",
            ...options,
            style: { display: "none" },
        });
    }
    openFileSelector() {
        this.htmlElement.click();
    }
}
//# sourceMappingURL=InvisibleFileInput.js.map