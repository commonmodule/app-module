import { EventContainer } from "@commonmodule/ts";
import Store from "../store/Store.js";

class VolumeManager extends EventContainer<{
  backgroundMusicVolumeChanged: (volume: number) => void;
  soundEffectVolumeChanged: (volume: number) => void;
}> {
  private store = new Store("volume-manager");

  public get backgroundMusicVolume(): number {
    return this.store.get("backgroundMusicVolume") ?? 0.5;
  }

  public set backgroundMusicVolume(volume: number) {
    this.store.setPermanent("backgroundMusicVolume", volume);
    this.emit("backgroundMusicVolumeChanged", volume);
  }

  public get soundEffectVolume(): number {
    return this.store.get("soundEffectVolume") ?? 0.8;
  }

  public set soundEffectVolume(volume: number) {
    this.store.setPermanent("soundEffectVolume", volume);
    this.emit("soundEffectVolumeChanged", volume);
  }
}

export default new VolumeManager();
