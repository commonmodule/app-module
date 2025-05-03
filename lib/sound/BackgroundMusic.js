import { IntegerUtils } from "@commonmodule/ts";
import AudioContextManager from "./AudioContextManager.js";
import Sound from "./Sound.js";
import VolumeManager from "./VolumeManager.js";
import Browser from "../utils/Browser.js";
export default class BackgroundMusic {
    sounds = [];
    currentSound;
    currentIndex = -1;
    constructor(sources) {
        if (!Array.isArray(sources))
            sources = [sources];
        for (const src of sources) {
            const url = AudioContextManager.canPlayOgg() && src.ogg
                ? src.ogg
                : src.mp3;
            const sound = new Sound(url, VolumeManager.backgroundMusicVolume);
            sound.on("ended", this.handleSoundEnded);
            this.sounds.push(sound);
        }
        if (Browser.isMobileDevice()) {
            document.addEventListener("visibilitychange", this.handleVisibilityChange);
        }
        VolumeManager.on("changeBackgroundMusicVolume", this.changeVolumeHandler);
    }
    getRandomTrack() {
        if (this.sounds.length <= 1) {
            return this.sounds[0];
        }
        let newIndex;
        do {
            newIndex = IntegerUtils.random(0, this.sounds.length - 1);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        return this.sounds[newIndex];
    }
    handleSoundEnded = () => {
        this.currentSound?.stop();
        this.currentSound = this.getRandomTrack();
        this.currentSound.play();
    };
    handleVisibilityChange = () => {
        if (this.currentSound)
            document.hidden ? this.pause() : this.play();
    };
    changeVolumeHandler = (volume) => {
        for (const sound of this.sounds) {
            sound.volume = volume;
        }
    };
    play() {
        if (!this.currentSound)
            this.currentSound = this.getRandomTrack();
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
        this.currentIndex = -1;
        return this;
    }
    remove() {
        for (const sound of this.sounds) {
            sound.remove();
        }
        if (Browser.isMobileDevice()) {
            document.removeEventListener("visibilitychange", this.handleVisibilityChange);
        }
        VolumeManager.off("changeBackgroundMusicVolume", this.changeVolumeHandler);
    }
}
//# sourceMappingURL=BackgroundMusic.js.map