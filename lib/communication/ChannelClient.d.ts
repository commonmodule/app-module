import { EventContainer } from "@common-module/ts";
export default abstract class ChannelClient extends EventContainer<{
    connect: () => void;
    disconnect: () => void;
}> {
    protected abstract transmit(rawMessage: string): void;
    protected parseAndEmit<T>(rawMessage: string): void;
}
//# sourceMappingURL=ChannelClient.d.ts.map