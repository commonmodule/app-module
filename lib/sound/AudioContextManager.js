import AppRoot from "../dom/AppRoot.js";
const canPlayOgg = new Audio().canPlayType("audio/ogg") !== "";
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
AppRoot.on("mousedown", () => audioContext.resume());
AppRoot.on("touchend", () => audioContext.resume());
class AudioContextManager {
    canPlayOgg() {
        return canPlayOgg;
    }
    getAudioContext() {
        return audioContext;
    }
    async getAvailableAudioContext() {
        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }
        return audioContext;
    }
}
export default new AudioContextManager();
//# sourceMappingURL=AudioContextManager.js.map