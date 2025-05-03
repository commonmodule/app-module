const canPlayOgg = new Audio().canPlayType("audio/ogg") !== "";

const audioContext =
  new (window.AudioContext || (window as any).webkitAudioContext)();
["mousedown", "touchend"].forEach((event) =>
  window.addEventListener(event, () => audioContext.resume())
);

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
