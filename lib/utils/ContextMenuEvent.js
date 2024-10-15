import { BrowserInfo } from "../BrowserInfo";
const LONG_PRESS_DURATION = 500;
export class ContextMenuUtil {
    static enhanceWithContextMenu(element, handler) {
        if (BrowserInfo.isIOS) {
            ContextMenuUtil.simulateContextMenuOnIOS(element, handler);
        }
        else {
            element.addEventListener("contextmenu", handler);
        }
    }
    static simulateContextMenuOnIOS(element, handler) {
        let longPressTimer;
        element.style.webkitUserSelect = "none";
        element.style.userSelect = "none";
        const startLongPress = (event) => {
            const touch = event.touches[0];
            const simulatedEvent = {
                ...event,
                clientX: touch?.clientX ?? 0,
                clientY: touch?.clientY ?? 0,
            };
            longPressTimer = window.setTimeout(() => {
                handler(simulatedEvent);
            }, LONG_PRESS_DURATION);
        };
        const cancelLongPress = () => {
            clearTimeout(longPressTimer);
        };
        element.addEventListener("touchstart", startLongPress);
        element.addEventListener("touchend", cancelLongPress);
        element.addEventListener("touchmove", cancelLongPress);
    }
}
//# sourceMappingURL=ContextMenuEvent.js.map