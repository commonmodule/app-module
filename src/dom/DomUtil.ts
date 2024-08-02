import DomSelector, { DomSelectorKey } from "./DomSelector.js";

class DomUtil {
  public createHtmlElement<HE extends HTMLElement>(selector: DomSelector): HE {
    const [tagName, rest] = (selector || "div").split(/[#.]/, 2) as [
      DomSelectorKey,
      string | undefined,
    ];
    const element = document.createElement(tagName || "div") as HE;
    if (rest) {
      const [id, ...classes] = rest.split(".");
      if (id && !id.includes("#")) element.id = id;
      if (classes.length > 0) element.className = classes.join(" ");
    }
    return element;
  }
}

export default new DomUtil();
