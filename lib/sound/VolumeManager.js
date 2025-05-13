import { EventContainer } from "@commonmodule/ts";
import Store from "../store/Store.js";
class VolumeManager extends EventContainer {
    store = new Store("volume-manager");
    get backgroundMusicVolume() {
        return this.store.get("backgroundMusicVolume") ?? 0.5;
    }
    set backgroundMusicVolume(volume) {
        this.store.setPermanent("backgroundMusicVolume", volume);
        this.emit("backgroundMusicVolumeChanged", volume);
    }
    get soundEffectVolume() {
        return this.store.get("soundEffectVolume") ?? 0.8;
    }
    set soundEffectVolume(volume) {
        this.store.setPermanent("soundEffectVolume", volume);
        this.emit("soundEffectVolumeChanged", volume);
    }
}
export default new VolumeManager();
//# sourceMappingURL=VolumeManager.js.map