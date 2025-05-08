export default class RandomSoundLooper {
    private _volume;
    private readonly sounds;
    private currentSound?;
    constructor(sources: string[], _volume?: number);
    private getRandomSound;
    private handleSoundEnded;
    private handleVisibilityChange;
    play(): this;
    pause(): this;
    stop(): this;
    set volume(volume: number);
    get volume(): number;
    remove(): void;
}
//# sourceMappingURL=RandomSoundLooper.d.ts.map