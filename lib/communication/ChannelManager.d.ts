import RealtimeClinet from "./RealtimeClient.js";
export default class ChannelManager<H extends Record<string, Record<string, (...args: any[]) => any>>> {
    private client;
    private handlers;
    constructor(client: RealtimeClinet);
    on<C extends keyof H, A extends keyof H[C]>(channel: C, action: A, handler: H[C][A]): this;
    off<C extends keyof H, A extends keyof H[C]>(channel: C, action: A, handler: H[C][A]): this;
    send(channel: string, action: string, data?: any): void;
    private emit;
    private parseAndEmit;
}
//# sourceMappingURL=ChannelManager.d.ts.map