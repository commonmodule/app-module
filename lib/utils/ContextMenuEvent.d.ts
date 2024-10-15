import { DomElement } from "../dom/DomElement";
interface ContextMenuEvent extends MouseEvent {
    clientX: number;
    clientY: number;
}
export declare class ContextMenuUtil {
    static enhanceWithContextMenu(element: DomElement, handler: (event: ContextMenuEvent) => void): void;
    private static simulateContextMenuOnIOS;
}
export {};
//# sourceMappingURL=ContextMenuEvent.d.ts.map