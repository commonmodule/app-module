import { ResourceLoader } from "@common-module/ts";
import AudioContextManager from "../sound/AudioContextManager.js";
class AudioBufferLoader extends ResourceLoader {
    async loadResource(src) {
        const loadPromise = (async () => {
            const response = await fetch(src);
            if (!response.ok)
                throw new Error(`Failed to load audio data: ${src}`);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await AudioContextManager.getAudioContext()
                .decodeAudioData(arrayBuffer);
            this.pendingLoads.delete(src);
            if (this.isResourceInUse(src)) {
                if (this.resources.has(src)) {
                    throw new Error(`Audio buffer already exists: ${src}`);
                }
                else {
                    this.resources.set(src, audioBuffer);
                    return audioBuffer;
                }
            }
            else {
                return undefined;
            }
        })();
        this.pendingLoads.set(src, loadPromise);
        return await loadPromise;
    }
}
export default new AudioBufferLoader();
//# sourceMappingURL=AudioBufferLoader.js.map