import { EventContainer, EventHandlers } from "@commonmodule/ts";
import Dom from "../dom/Dom.js";
export default abstract class View<Data = {}, Container extends Dom = Dom> {
    private eventListeners;
    protected container: Container;
    changeData(data: Data): void;
    protected addViewManagedEvent<T extends EventContainer<E>, E extends EventHandlers, K extends keyof E>(target: T, eventName: K, listener: (E & {
        visible: () => void;
        remove: () => void;
    })[K]): this;
    private removeAllEvents;
    close(): void;
}
//# sourceMappingURL=View.d.ts.map