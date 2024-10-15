import DomNode from "../dom/DomNode.js";
import BrowserInfo from "./BrowserInfo.js";

const LONG_PRESS_DURATION = 500;

class DomUtils {
  public enhanceWithContextMenu(
    dom: DomNode,
    handler: (event: MouseEvent) => void,
  ) {
    if (BrowserInfo.isIOS) {
      this.simulateContextMenuOnIOS(dom, handler);
    } else {
      dom.onDom("contextmenu", (event: MouseEvent) => {
        event.preventDefault();
        handler(event);
      });
    }
  }

  private simulateContextMenuOnIOS(
    dom: DomNode,
    handler: (event: MouseEvent) => void,
  ): void {
    let longPressTimer: number;

    dom.style({ "-webkit-user-select": "none", "user-select": "none" });

    const startLongPress = (event: TouchEvent) => {
      const touch = event.touches[0];
      const simulatedEvent = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: touch?.clientX ?? 0,
        clientY: touch?.clientY ?? 0,
      });

      longPressTimer = window.setTimeout(
        () => handler(simulatedEvent),
        LONG_PRESS_DURATION,
      );
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
