import { EventContainer } from "@commonmodule/ts";
export default class Sound extends EventContainer<{
    ended: () => void;
}> {
    private readonly src;
    private _volume;
    private readonly loop;
    private isPlaying;
    private isPaused;
    private loadAudioPromise;
    private audioBuffer?;
    private audioContext?;
    private gainNode?;
    private source?;
    private startTime;
    private pauseTime;
    private offset;
    protected isAudioInitialized: boolean;
    constructor(src: string, _volume?: number, loop?: boolean);
    private loadAudio;
    private initializeAudio;
    play(): this;
    private stopSource;
    pause(): this;
    stop(): this;
    set volume(volume: number);
    get volume(): number;
    remove(): void;
}
//# sourceMappingURL=Sound.d.ts.map