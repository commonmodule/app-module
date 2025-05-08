import { EventContainer } from "@commonmodule/ts";
import AudioBufferLoader from "../loaders/AudioBufferLoader.js";
import Browser from "../utils/Browser.js";
import AudioContextManager from "./AudioContextManager.js";
export default class Sound extends EventContainer {
    src;
    _volume;
    loop;
    isPlaying = false;
    isPaused = false;
    loadAudioPromise;
    audioBuffer;
    audioContext;
    gainNode;
    source;
    startTime = 0;
    pauseTime = 0;
    offset = 0;
    isAudioInitialized = false;
    constructor(src, _volume = 0.8, loop = false) {
        super();
        this.src = src;
        this._volume = _volume;
        this.loop = loop;
        this.loadAudioPromise = this.loadAudio();
    }
    async loadAudio() {
        this.audioBuffer = await AudioBufferLoader.load(this.src);
    }
    async initializeAudio() {
        if (!this.audioBuffer)
            await this.loadAudioPromise;
        if (!this.isPlaying)
            return;
        if (!this.audioContext) {
            this.audioContext = await AudioContextManager.getAvailableAudioContext();
        }
        if (!this.isPlaying)
            return;
        if (!this.gainNode) {
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = this._volume;
            this.gainNode.connect(this.audioContext.destination);
        }
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.audioBuffer;
        this.source.loop = this.loop;
        this.source.connect(this.gainNode);
        this.source.start(0, this.offset);
        this.startTime = this.audioContext.currentTime;
        this.source.onended = () => {
            if (!this.isPaused) {
                const isPlaying = this.isPlaying;
                if (!this.loop)
                    this.stop();
                if (isPlaying)
                    this.emit("ended");
            }
        };
        this.isAudioInitialized = true;
    }
    play() {
        if (Browser.isMobileDevice() && !Browser.isPageVisible()) {
            return this;
        }
        if (this.isPlaying)
            this.stop();
        if (!this.isPaused)
            this.offset = 0;
        this.isPlaying = true;
        this.isPaused = false;
        this.initializeAudio();
        return this;
    }
    stopSource() {
        if (this.source) {
            this.source.stop();
            this.source.disconnect();
            this.source = undefined;
        }
    }
    pause() {
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
    stop() {
        this.isPlaying = false;
        this.isPaused = false;
        this.offset = 0;
        this.stopSource();
        return this;
    }
    set volume(volume) {
        this._volume = Math.max(0, Math.min(1, volume));
        if (this.gainNode) {
            this.gainNode.gain.value = this._volume;
        }
    }
    get volume() {
        return this._volume;
    }
    remove() {
        this.stop();
        if (this.gainNode) {
            this.gainNode.disconnect();
            this.gainNode = undefined;
        }
        this.audioBuffer = undefined;
        this.audioContext = undefined;
        AudioBufferLoader.release(this.src);
        super.remove();
    }
}
//# sourceMappingURL=Sound.js.map