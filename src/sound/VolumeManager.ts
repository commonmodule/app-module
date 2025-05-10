import { EventContainer } from "@commonmodule/ts";
import Store from "../store/Store.js";

class VolumeManager extends EventContainer<{
  changeBackgroundMusicVolume: (volume: number) => void;
  changeSoundEffectVolume: (volume: number) => void;
}> {
  private store = new Store("volume-manager");

  public get backgroundMusicVolume(): number {
    return this.store.get("backgroundMusicVolume") ?? 0.5;
  }

  public set backgroundMusicVolume(volume: number) {
    this.store.setPermanent("backgroundMusicVolume", volume);
    this.emit("changeBackgroundMusicVolume", volume);
  }

  public get soundEffectVolume(): number {
    return this.store.get("soundEffectVolume") ?? 0.8;
  }

  public set soundEffectVolume(volume: number) {
    this.store.setPermanent("soundEffectVolume", volume);
    this.emit("changeSoundEffectVolume", volume);
  }
}

export default new VolumeManager();
