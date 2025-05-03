export default class BackgroundMusic {
    private readonly sounds;
    private currentSound?;
    private currentIndex;
    constructor(sources: {
        ogg?: string;
        mp3: string;
    } | {
        ogg?: string;
        mp3: string;
    }[]);
    private getRandomTrack;
    private handleSoundEnded;
    private handleVisibilityChange;
    private changeVolumeHandler;
    play(): this;
    pause(): this;
    stop(): this;
    remove(): void;
}
//# sourceMappingURL=BackgroundMusic.d.ts.map