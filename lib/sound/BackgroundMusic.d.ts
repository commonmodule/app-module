import { EventContainer } from "@commonmodule/ts";
export default class BackgroundMusic extends EventContainer {
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
    play(): this;
    pause(): this;
    stop(): this;
    remove(): void;
}
//# sourceMappingURL=BackgroundMusic.d.ts.map