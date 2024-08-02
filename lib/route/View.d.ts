import DomNode from "../dom/DomNode.js";
export interface ViewParams {
    [name: string]: string | undefined;
}
export default abstract class View {
    protected closed: boolean;
    protected container: DomNode;
    changeParams(params: ViewParams): void;
    close(): void;
}
//# sourceMappingURL=View.d.ts.map