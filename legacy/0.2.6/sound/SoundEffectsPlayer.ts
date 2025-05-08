import { ArrayUtils, IntegerUtils } from "@commonmodule/ts";
import Sound from "./Sound.js";
import VolumeManager from "./VolumeManager.js";

class SoundEffectsPlayer {
  private playingSounds: Sound[] = [];

  constructor() {
    VolumeManager.on("changeSoundEffectsVolume", (volume) => {
      for (const sound of this.playingSounds) {
        sound.volume = volume;
      }
    });
  }

  public play(urls: string | string[]): void {
    if (!Array.isArray(urls)) urls = [urls];
    const url = urls[IntegerUtils.random(0, urls.length - 1)];
    const sound: Sound = new Sound(url, VolumeManager.soundEffectsVolume)
      .play()
      .on("ended", () => {
        sound.remove();
        ArrayUtils.pull(this.playingSounds, sound);
      });
    this.playingSounds.push(sound);
  }
}

export default new SoundEffectsPlayer();
