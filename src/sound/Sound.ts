import { EventContainer } from "@commonmodule/ts";
import AudioBufferLoader from "../loaders/AudioBufferLoader.js";
import Browser from "../utils/Browser.js";
import AudioContextManager from "./AudioContextManager.js";

export default class Sound extends EventContainer<{ ended: () => void }> {
  private isPlaying = false;
  private isPaused = false;
  private loadAudioPromise: Promise<void>;

  private audioBuffer?: AudioBuffer;
  private audioContext?: AudioContext;
  private gainNode?: GainNode;
  private source?: AudioBufferSourceNode;

  private startTime = 0;
  private pauseTime = 0;
  private offset = 0;

  protected isAudioInitialized = false;

  constructor(
    private readonly src: string,
    private _volume = 0.8,
    private readonly loop = false,
  ) {
    super();
    this.loadAudioPromise = this.loadAudio();
  }

  private async loadAudio(): Promise<void> {
    this.audioBuffer = await AudioBufferLoader.load(this.src);
  }

  private async initializeAudio(): Promise<void> {
    if (!this.audioBuffer) await this.loadAudioPromise;
    if (!this.isPlaying) return;

    if (!this.audioContext) {
      this.audioContext = await AudioContextManager.getAvailableAudioContext();
    }
    if (!this.isPlaying) return;

    if (!this.gainNode) {
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this._volume;
      this.gainNode.connect(this.audioContext.destination);
    }

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer!;
    this.source.loop = this.loop;
    this.source.connect(this.gainNode);
    this.source.start(0, this.offset);
    this.startTime = this.audioContext.currentTime;

    this.source.onended = () => {
      if (!this.isPaused) {
        const isPlaying = this.isPlaying;
        if (!this.loop) this.stop();
        if (isPlaying) this.emit("ended");
      }
    };

    this.isAudioInitialized = true;
  }

  public play(): this {
    if (Browser.isMobileDevice() && !Browser.isPageVisible()) {
      return this;
    }

    if (this.isPlaying) this.stop();
    if (!this.isPaused) this.offset = 0;

    this.isPlaying = true;
    this.isPaused = false;
    this.initializeAudio();
    return this;
  }

  private stopSource(): void {
    if (this.source) {
      this.source.stop();
      this.source.disconnect();
      this.source = undefined;
    }
  }

  public pause(): this {
    if (this.isPlaying && !this.isPaused) {
      if (this.audioContext) {
        this.pauseTime = this.audioContext.currentTime;
        this.offset += this.pauseTime - this.startTime;
      }
      this.isPaused = true;
      this.isPlaying = false;
      this.stopSource();
    }
    return this;
  }

  public stop(): this {
    this.isPlaying = false;
    this.isPaused = false;
    this.offset = 0;
    this.stopSource();
    return this;
  }

  public set volume(volume: number) {
    this._volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this._volume;
    }
  }

  public get volume(): number {
    return this._volume;
  }

  public remove(): void {
    this.stop();
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = undefined;
    }
    this.audioBuffer = undefined;
    this.audioContext = undefined;
    AudioBufferLoader.release(this.src);
    this.clearEvents();
  }
}
