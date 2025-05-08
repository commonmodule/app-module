import Dom from "./Dom.js";
export default class QueriedDom extends Dom {
    constructor(selector) {
        super(document.querySelector(selector));
    }
    isVisible() {
        return true;
    }
}
//# sourceMappingURL=QueriedDom.js.map