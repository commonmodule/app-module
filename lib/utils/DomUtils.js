import Browser from "./Browser.js";
const LONG_PRESS_DURATION = 500;
class DomUtils {
    enhanceWithContextMenu(dom, handler) {
        if (Browser.isIOS()) {
            this.simulateContextMenuOnIOS(dom, handler);
        }
        else {
            dom.onDom("contextmenu", (event) => {
                event.preventDefault();
                handler(event);
            });
        }
    }
    simulateContextMenuOnIOS(dom, handler) {
        let longPressTimer;
        dom.style({ "-webkit-user-select": "none", "user-select": "none" });
        const startLongPress = (event) => {
            const touch = event.touches[0];
            const simulatedEvent = new MouseEvent("contextmenu", {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: touch?.clientX ?? 0,
                clientY: touch?.clientY ?? 0,
            });
            longPressTimer = window.setTimeout(() => handler(simulatedEvent), LONG_PRESS_DURATION);
        };
        const cancelLongPress = () => {
            clearTimeout(longPressTimer);
        };
        dom.onDom("touchstart", startLongPress)
            .onDom("touchend", cancelLongPress)
            .onDom("touchmove", cancelLongPress);
    }
}
export default new DomUtils();
//# sourceMappingURL=DomUtils.js.map