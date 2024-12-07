import { EventContainer } from "@common-module/ts";
import RealtimeClinet from "./RealtimeClient.js";
export default class WebSocketClient extends EventContainer<{
    connect: () => void;
    receive: (message: string) => void;
    disconnect: () => void;
}> implements RealtimeClinet {
    private url;
    private socket;
    isConnected(): boolean;
    constructor(url: string);
    private connect;
    send(data: string): void;
}
//# sourceMappingURL=WebSocketClient.d.ts.map