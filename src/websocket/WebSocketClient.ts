import { EventContainer, RealtimeClient } from "@commonmodule/ts";

export default class WebSocketClient extends EventContainer<{
  connect: () => void;
  disconnect: () => void;
}> implements RealtimeClient {
  private socket: WebSocket | undefined;
  private messageHandlers: Array<(message: string) => void> = [];

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

  public send(data: string): void {
    if (!this.socket) throw new Error("Socket is not connected");
    this.socket.send(data);
  }

  public onMessage(handler: (message: string) => void): void {
    this.messageHandlers.push(handler);
  }
}
