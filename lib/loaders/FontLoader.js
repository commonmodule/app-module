import { ResourceLoader } from "@common-module/ts";
class FontLoader extends ResourceLoader {
    async loadResource(fontName) {
        const loadPromise = (async () => {
            if ("fonts" in document) {
                await document.fonts.load(`1em ${fontName}`);
                await document.fonts.ready;
            }
            else {
                const span = window.document.createElement("span");
                span.style.fontFamily = "sans-serif";
                span.style.position = "absolute";
                span.style.visibility = "hidden";
                span.style.fontSize = "72px";
                span.textContent = "FontCheck";
                window.document.body.appendChild(span);
                const initialWidth = span.offsetWidth;
                span.style.fontFamily = `${fontName}, sans-serif`;
                await new Promise((resolve) => {
                    const checkInterval = setInterval(() => {
                        if (span.offsetWidth !== initialWidth) {
                            clearInterval(checkInterval);
                            document.body.removeChild(span);
                            resolve();
                        }
                    }, 100);
                });
            }
            this.pendingLoads.delete(fontName);
            return true;
        })();
        this.pendingLoads.set(fontName, loadPromise);
        return await loadPromise;
    }
    cleanup(_) {
    }
}
export default new FontLoader();
//# sourceMappingURL=FontLoader.js.map