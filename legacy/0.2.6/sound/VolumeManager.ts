import { EventContainer } from "@commonmodule/ts";
import Store from "../store/Store.js";

class VolumeManager extends EventContainer<{
  changeBackgroundMusicVolume: (volume: number) => void;
  changeSoundEffectsVolume: (volume: number) => void;
}> {
  private store = new Store("volume-manager");

  public get backgroundMusicVolume(): number {
    return this.store.get("backgroundMusicVolume") ?? 0.5;
  }

  public set backgroundMusicVolume(volume: number) {
    this.store.setPermanent("backgroundMusicVolume", volume);
    this.emit("changeBackgroundMusicVolume", volume);
  }

  public get soundEffectsVolume(): number {
    return this.store.get("soundEffectsVolume") ?? 0.8;
  }

  public set soundEffectsVolume(volume: number) {
    this.store.setPermanent("soundEffectsVolume", volume);
    this.emit("changeSoundEffectsVolume", volume);
  }
}

export default new VolumeManager();
