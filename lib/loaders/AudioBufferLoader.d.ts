import { ResourceLoader } from "@commonmodule/ts";
declare class AudioBufferLoader extends ResourceLoader<AudioBuffer> {
    protected loadResource(src: string): Promise<AudioBuffer | undefined>;
}
declare const _default: AudioBufferLoader;
export default _default;
//# sourceMappingURL=AudioBufferLoader.d.ts.map