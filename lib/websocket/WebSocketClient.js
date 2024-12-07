import { EventContainer } from "@common-module/ts";
export default class WebSocketClient extends EventContainer {
    url;
    socket;
    messageHandlers = [];
    isConnected() {
        return this.socket !== undefined;
    }
    constructor(url) {
        super();
        this.url = url;
        this.connect();
    }
    connect() {
        const socket = new WebSocket(this.url);
        socket.onopen = () => {
            this.socket = socket;
            this.emit("connect");
        };
        socket.onmessage = (event) => {
            for (const handler of this.messageHandlers) {
                handler(event.data);
            }
        };
        socket.onclose = () => {
            this.socket = undefined;
            this.emit("disconnect");
            setTimeout(() => this.connect(), 1000);
        };
    }
    send(data) {
        if (!this.socket)
            throw new Error("Socket is not connected");
        this.socket.send(data);
    }
    onMessage(handler) {
        this.messageHandlers.push(handler);
    }
}
//# sourceMappingURL=WebSocketClient.js.map