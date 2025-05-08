export default class QueriedDom extends Dom {
    constructor(selector) {
        super(document.querySelector(selector));
    }
    isVisible() {
        return true;
    }
}
//# sourceMappingURL=QueriedDomNode.js.map