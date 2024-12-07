import { EventContainer } from "@common-module/ts";
import RealtimeClinet from "./RealtimeClient.js";

export default class WebSocketClient extends EventContainer<{
  connect: () => void;
  receive: (message: string) => void;
  disconnect: () => void;
}> implements RealtimeClinet {
  private socket: WebSocket | undefined;

  public isConnected(): boolean {
    return this.socket !== undefined;
  }

  constructor(private url: string) {
    super();
    this.connect();
  }

  private connect(): void {
    const socket = new WebSocket(this.url);

    socket.onopen = () => {
      this.socket = socket;
      this.emit("connect");
    };

    socket.onmessage = (event) => {
      this.emit("receive", event.data);
    };

    socket.onclose = () => {
      this.socket = undefined;
      this.emit("disconnect");
      setTimeout(() => this.connect(), 1000);
    };
  }

  public send(data: string): void {
    if (!this.socket) throw new Error("Socket is not connected");
    this.socket.send(data);
  }
}
