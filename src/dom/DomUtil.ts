import DomSelector from "./DomSelector.js";

class DomUtil {
  public createHtmlElement<HE extends HTMLElement>(selector: DomSelector): HE {
    const parts = (selector || "div").split(/([#.])/);
    const tagName = parts[0] || "div";
    const element = document.createElement(tagName) as HE;

    let currentType: "#" | "." | "" = "";
    for (let i = 1; i < parts.length; i += 2) {
      currentType = parts[i] as "#" | ".";
      const value = parts[i + 1];
      if (currentType === "#") element.id = value;
      else if (currentType === ".") element.classList.add(value);
    }

    return element;
  }
}

export default new DomUtil();
