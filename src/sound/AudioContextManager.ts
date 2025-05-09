import AppRoot from "../dom/AppRoot.js";

const canPlayOgg = new Audio().canPlayType("audio/ogg") !== "";
const audioContext =
  new (window.AudioContext || (window as any).webkitAudioContext)();

AppRoot.on("mousedown", () => audioContext.resume());
AppRoot.on("touchend", () => audioContext.resume());

class AudioContextManager {
  public canPlayOgg(): boolean {
    return canPlayOgg;
  }

  public getAudioContext(): AudioContext {
    return audioContext;
  }

  public async getAvailableAudioContext(): Promise<AudioContext> {
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }
    return audioContext;
  }
}

export default new AudioContextManager();
