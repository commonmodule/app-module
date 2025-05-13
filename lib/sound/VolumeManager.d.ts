import { EventContainer } from "@commonmodule/ts";
declare class VolumeManager extends EventContainer<{
    backgroundMusicVolumeChanged: (volume: number) => void;
    soundEffectVolumeChanged: (volume: number) => void;
}> {
    private store;
    get backgroundMusicVolume(): number;
    set backgroundMusicVolume(volume: number);
    get soundEffectVolume(): number;
    set soundEffectVolume(volume: number);
}
declare const _default: VolumeManager;
export default _default;
//# sourceMappingURL=VolumeManager.d.ts.map