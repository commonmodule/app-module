import DomNode from "../dom/DomNode.js";
export interface ViewParams {
    [name: string]: string | undefined;
}
export default abstract class View<CT extends DomNode = DomNode> {
    protected container: CT;
    changeParams(params: ViewParams): void;
    close(): void;
}
//# sourceMappingURL=View.d.ts.map