import Dom from "../dom/Dom.js";
import Browser from "./Browser.js";

const LONG_PRESS_DURATION = 500;

export default class DomUtils {
  private static simulateContextMenuOnIOS(
    dom: Dom,
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

    dom
      .on("touchstart", startLongPress)
      .on("touchend", cancelLongPress)
      .on("touchmove", cancelLongPress);
  }

  public static enhanceWithContextMenu(
    dom: Dom,
    handler: (event: MouseEvent) => void,
  ) {
    if (Browser.isIOS()) {
      this.simulateContextMenuOnIOS(dom, handler);
    } else {
      dom.on("contextmenu", (event: MouseEvent) => {
        event.preventDefault();
        handler(event);
      });
    }
  }
}
