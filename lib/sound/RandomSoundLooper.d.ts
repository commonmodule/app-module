import { EventContainer } from "@commonmodule/ts";
export default class RandomSoundLooper extends EventContainer {
    private _volume;
    private readonly sounds;
    private currentSound?;
    constructor(sources: string[], _volume?: number);
    private getRandomSound;
    private handleSoundEnded;
    play(): this;
    pause(): this;
    stop(): this;
    set volume(volume: number);
    get volume(): number;
    remove(): void;
}
//# sourceMappingURL=RandomSoundLooper.d.ts.map