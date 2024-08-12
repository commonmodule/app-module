class DomUtil {
    createHtmlElement(selector) {
        const parts = (selector || "div").split(/([#.])/);
        const tagName = parts[0] || "div";
        const element = document.createElement(tagName);
        let currentType = "";
        for (let i = 1; i < parts.length; i += 2) {
            currentType = parts[i];
            const value = parts[i + 1];
            if (currentType === "#")
                element.id = value;
            else if (currentType === ".")
                element.classList.add(value);
        }
        return element;
    }
}
export default new DomUtil();
//# sourceMappingURL=DomUtil.js.map