import DomNode from "./DomNode.js";
export default class QueriedDomNode extends DomNode {
    constructor(selector) {
        super(document.querySelector(selector));
    }
    isVisible() {
        return true;
    }
}
//# sourceMappingURL=QueriedDomNode.js.map