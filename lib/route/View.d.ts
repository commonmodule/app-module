import { EventContainer } from "@common-module/ts";
import DomNode from "../dom/DomNode.js";
export interface ViewParams {
    [name: string]: string | undefined;
}
export default abstract class View<CT extends DomNode = DomNode> {
    private eventListeners;
    protected container: CT;
    changeParams(params: ViewParams): void;
    protected addEvent<T extends EventContainer<ET>, ET extends Record<string, (...args: any[]) => any>, K extends keyof ET>(target: T, eventName: K, listener: (ET & {
        visible: () => void;
        remove: () => void;
    })[K]): this;
    private removeAllEvents;
    close(): void;
}
//# sourceMappingURL=View.d.ts.map