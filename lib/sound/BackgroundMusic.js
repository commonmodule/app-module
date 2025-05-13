import { EventContainer, IntegerUtils } from "@commonmodule/ts";
import AppRoot from "../dom/AppRoot.js";
import Browser from "../utils/Browser.js";
import AudioContextManager from "./AudioContextManager.js";
import Sound from "./Sound.js";
import VolumeManager from "./VolumeManager.js";
export default class BackgroundMusic extends EventContainer {
    sounds = [];
    currentSound;
    currentIndex = -1;
    constructor(sources) {
        super();
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
            AppRoot.bind(this, "visibilitychange", () => {
                if (this.currentSound)
                    document.hidden ? this.pause() : this.play();
            });
        }
        VolumeManager.on("backgroundMusicVolumeChanged", (volume) => {
            for (const sound of this.sounds) {
                sound.volume = volume;
            }
        });
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
        super.remove();
    }
}
//# sourceMappingURL=BackgroundMusic.js.map