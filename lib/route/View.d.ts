import { EventContainer } from "@commonmodule/ts";
import DomNode from "../dom/DomNode.js";
export default abstract class View<DT = {}, CT extends DomNode = DomNode> {
    private eventListeners;
    protected container: CT;
    changeData(data: DT): void;
    protected addViewManagedEvent<T extends EventContainer<E>, E extends Record<string, (...args: any[]) => any>, K extends keyof E>(target: T, eventName: K, listener: (E & {
        visible: () => void;
        remove: () => void;
    })[K]): this;
    private removeAllEvents;
    close(): void;
}
//# sourceMappingURL=View.d.ts.map