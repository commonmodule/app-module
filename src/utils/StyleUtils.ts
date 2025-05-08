import Dom from "../dom/Dom.js";

class StyleUtils {
  public applyTextStroke(dom: Dom, width: number, color: string) {
    let shadow = "";
    for (let i = -width; i <= width; i++) {
      for (let j = -width; j <= width; j++) {
        if (i !== 0 || j !== 0) {
          shadow += `${i}px ${j}px 0 ${color},`;
        }
      }
    }
    shadow = shadow.slice(0, -1); // Remove last comma
    dom.style({ textShadow: shadow });
  }
}

export default new StyleUtils();
