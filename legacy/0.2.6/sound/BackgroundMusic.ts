import { IntegerUtils } from "@commonmodule/ts";
import AudioContextManager from "./AudioContextManager.js";
import Sound from "./Sound.js";
import VolumeManager from "./VolumeManager.js";
import Browser from "../utils/Browser.js";

export default class BackgroundMusic {
  private readonly sounds: Sound[] = [];
  private currentSound?: Sound;
  private currentIndex: number = -1;

  constructor(
    sources: { ogg?: string; mp3: string } | { ogg?: string; mp3: string }[],
  ) {
    if (!Array.isArray(sources)) sources = [sources];
    for (const src of sources) {
      const url = AudioContextManager.canPlayOgg() && src.ogg
        ? src.ogg
        : src.mp3;
      const sound = new Sound(url, VolumeManager.backgroundMusicVolume);
      sound.on("ended", this.handleSoundEnded);
      this.sounds.push(sound);
    }

    if (Browser.isMobileDevice()) {
      document.addEventListener(
        "visibilitychange",
        this.handleVisibilityChange,
      );
    }

    VolumeManager.on("changeBackgroundMusicVolume", this.changeVolumeHandler);
  }

  private getRandomTrack(): Sound {
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

  private handleSoundEnded = () => {
    this.currentSound?.stop();
    this.currentSound = this.getRandomTrack();
    this.currentSound.play();
  };

  private handleVisibilityChange = (): void => {
    if (this.currentSound) document.hidden ? this.pause() : this.play();
  };

  private changeVolumeHandler = (volume: number): void => {
    for (const sound of this.sounds) {
      sound.volume = volume;
    }
  };

  public play(): this {
    if (!this.currentSound) this.currentSound = this.getRandomTrack();
    this.currentSound.play();
    return this;
  }

  public pause(): this {
    this.currentSound?.pause();
    return this;
  }

  public stop(): this {
    this.currentSound?.stop();
    this.currentSound = undefined;
    this.currentIndex = -1;
    return this;
  }

  public remove(): void {
    for (const sound of this.sounds) {
      sound.remove();
    }

    if (Browser.isMobileDevice()) {
      document.removeEventListener(
        "visibilitychange",
        this.handleVisibilityChange,
      );
    }

    VolumeManager.off("changeBackgroundMusicVolume", this.changeVolumeHandler);
  }
}
