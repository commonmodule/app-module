import { EventContainer, IntegerUtils } from "@commonmodule/ts";
import AppRoot from "../dom/AppRoot.js";
import Browser from "../utils/Browser.js";
import Sound from "./Sound.js";
export default class RandomSoundLooper extends EventContainer {
    _volume;
    sounds = [];
    currentSound;
    constructor(sources, _volume = 0.8) {
        super();
        this._volume = _volume;
        for (const src of sources) {
            const sound = new Sound(src, _volume);
            sound.on("ended", this.handleSoundEnded);
            this.sounds.push(sound);
        }
        if (Browser.isMobileDevice()) {
            AppRoot.bind(this, "visibilitychange", () => {
                document.hidden ? this.pause() : this.play();
            });
        }
    }
    getRandomSound() {
        if (this.sounds.length <= 1)
            return this.sounds[0];
        return this.sounds[IntegerUtils.random(0, this.sounds.length - 1)];
    }
    handleSoundEnded = () => {
        this.currentSound?.stop();
        this.currentSound = this.getRandomSound();
        this.currentSound.play();
    };
    play() {
        if (!this.currentSound) {
            this.currentSound = this.getRandomSound();
        }
        this.currentSound.play();
        return this;
    }
    pause() {
        this.currentSound?.pause();
        return this;
    }
    stop() {
        this.currentSound?.stop();
        this.currentSound = undefined;
        return this;
    }
    set volume(volume) {
        this._volume = volume;
        for (const sound of this.sounds) {
            sound.volume = volume;
        }
    }
    get volume() {
        return this.currentSound ? this.currentSound.volume : this._volume;
    }
    remove() {
        for (const sound of this.sounds) {
            sound.remove();
        }
        super.remove();
    }
}
//# sourceMappingURL=RandomSoundLooper.js.map