import { EventContainer } from "@commonmodule/ts";
declare class VolumeManager extends EventContainer<{
    changeBackgroundMusicVolume: (volume: number) => void;
    changeSoundEffectVolume: (volume: number) => void;
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