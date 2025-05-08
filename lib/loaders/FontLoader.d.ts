import { ResourceLoader } from "@commonmodule/ts";
declare class FontLoader extends ResourceLoader<boolean> {
    protected loadResource(fontName: string): Promise<boolean | undefined>;
}
declare const _default: FontLoader;
export default _default;
//# sourceMappingURL=FontLoader.d.ts.map