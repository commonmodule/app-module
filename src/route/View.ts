import DomNode from "../dom/DomNode.js";

export interface ViewParams {
  [name: string]: string | undefined;
}

export default abstract class View<CT extends DomNode = DomNode> {
  protected container!: CT;

  public changeParams(params: ViewParams): void {}
  public close(): void {
    this.container?.remove();
  }
}
