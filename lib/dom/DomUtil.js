class DomUtil {
    createHtmlElement(selector) {
        const [tagName, rest] = (selector || "div").split(/[#.]/, 2);
        const element = document.createElement(tagName || "div");
        if (rest) {
            const [id, ...classes] = rest.split(".");
            if (id && !id.includes("#"))
                element.id = id;
            if (classes.length > 0)
                element.className = classes.join(" ");
        }
        return element;
    }
}
export default new DomUtil();
//# sourceMappingURL=DomUtil.js.map