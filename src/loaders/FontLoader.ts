import { ResourceLoader } from "@common-module/ts";

class FontLoader extends ResourceLoader<boolean> {
  protected async loadResource(fontName: string): Promise<boolean | undefined> {
    const loadPromise = (async () => {
      if ("fonts" in document) {
        await document.fonts.load(`1em ${fontName}`);
        await document.fonts.ready;
        return true;
      } else {
        const span = window.document.createElement("span");
        span.style.fontFamily = "sans-serif";
        span.style.position = "absolute";
        span.style.visibility = "hidden";
        span.style.fontSize = "72px";
        span.textContent = "FontCheck";
        window.document.body.appendChild(span);

        const initialWidth = span.offsetWidth;
        span.style.fontFamily = `${fontName}, sans-serif`;

        await new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            if (span.offsetWidth !== initialWidth) {
              clearInterval(checkInterval);
              document.body.removeChild(span);
              resolve();
            }
          }, 100);
        });
      }
    })();

    this.pendingLoads.set(fontName, loadPromise);
    return await loadPromise;
  }

  protected cleanup(_: boolean): void {
    // No cleanup necessary for font
  }
}

export default new FontLoader();
