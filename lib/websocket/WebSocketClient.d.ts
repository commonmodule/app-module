import { EventContainer } from "@common-module/ts";
export default class WebSocketClient extends EventContainer<{
    connect: () => void;
    disconnect: () => void;
}> {
    private url;
    private socket;
    isConnected(): boolean;
    constructor(url: string);
    private connect;
    send(data: string): void;
}
//# sourceMappingURL=WebSocketClient.d.ts.map