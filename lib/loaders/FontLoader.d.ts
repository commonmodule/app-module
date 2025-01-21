import { ResourceLoader } from "@common-module/ts";
declare class FontLoader extends ResourceLoader<boolean> {
    protected loadResource(fontName: string): Promise<boolean | undefined>;
    protected cleanup(_: boolean): void;
}
declare const _default: FontLoader;
export default _default;
//# sourceMappingURL=FontLoader.d.ts.map