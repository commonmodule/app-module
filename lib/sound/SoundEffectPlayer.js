import { ArrayUtils, IntegerUtils } from "@commonmodule/ts";
import Sound from "./Sound.js";
import VolumeManager from "./VolumeManager.js";
class SoundEffectPlayer {
    playingSounds = [];
    constructor() {
        VolumeManager.on("soundEffectVolumeChanged", (volume) => {
            for (const sound of this.playingSounds) {
                sound.volume = volume;
            }
        });
    }
    play(urls) {
        if (!Array.isArray(urls))
            urls = [urls];
        const url = urls[IntegerUtils.random(0, urls.length - 1)];
        const sound = new Sound(url, VolumeManager.soundEffectVolume)
            .play()
            .on("ended", () => {
            sound.remove();
            ArrayUtils.pull(this.playingSounds, sound);
        });
        this.playingSounds.push(sound);
    }
}
export default new SoundEffectPlayer();
//# sourceMappingURL=SoundEffectPlayer.js.map