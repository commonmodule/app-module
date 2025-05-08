import { EventContainer } from "@commonmodule/ts";
import Store from "../store/Store.js";
class VolumeManager extends EventContainer {
    store = new Store("volume-manager");
    get backgroundMusicVolume() {
        return this.store.get("backgroundMusicVolume") ?? 0.5;
    }
    set backgroundMusicVolume(volume) {
        this.store.setPermanent("backgroundMusicVolume", volume);
        this.emit("changeBackgroundMusicVolume", volume);
    }
    get soundEffectsVolume() {
        return this.store.get("soundEffectsVolume") ?? 0.8;
    }
    set soundEffectsVolume(volume) {
        this.store.setPermanent("soundEffectsVolume", volume);
        this.emit("changeSoundEffectsVolume", volume);
    }
}
export default new VolumeManager();
//# sourceMappingURL=VolumeManager.js.map