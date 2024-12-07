import { EventContainer, RealtimeClient } from "@common-module/ts";
export default class WebSocketClient extends EventContainer<{
    connect: () => void;
    disconnect: () => void;
}> implements RealtimeClient {
    private url;
    private socket;
    private messageHandlers;
    isConnected(): boolean;
    constructor(url: string);
    private connect;
    send(data: string): void;
    onMessage(handler: (message: string) => void): void;
}
//# sourceMappingURL=WebSocketClient.d.ts.map