import DomNode from "./DomNode.js";
const el = function (elementOrSelector, ...children) {
    return new DomNode(elementOrSelector, ...children);
};
export default el;
//# sourceMappingURL=el.js.map