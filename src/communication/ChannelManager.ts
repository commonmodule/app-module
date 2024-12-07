import RealtimeClinet from "./RealtimeClient.js";

interface Message {
  channel: string;
  action: string;
  data?: any;
}

export default class ChannelManager<
  H extends Record<string, Record<string, (...args: any[]) => any>>,
> {
  private handlers: { [C in keyof H]?: { [A in keyof H[C]]?: H[C][A][] } } = {};

  constructor(private client: RealtimeClinet) {
    client.on("receive", (rawMessage) => this.parseAndEmit(rawMessage));
  }

  public on<C extends keyof H, A extends keyof H[C]>(
    channel: C,
    action: A,
    handler: H[C][A],
  ): this {
    if (!this.handlers[channel]) this.handlers[channel] = {};
    const channelHandlers = this.handlers[channel]!;
    if (!channelHandlers[action]) channelHandlers[action] = [];
    channelHandlers[action]!.push(handler);
    return this;
  }

  public off<C extends keyof H, A extends keyof H[C]>(
    channel: C,
    action: A,
    handler: H[C][A],
  ): this {
    const channelHandlers = this.handlers[channel];
    if (!channelHandlers) return this;

    const actionHandlers = channelHandlers[action];
    if (!actionHandlers) return this;

    const index = actionHandlers.indexOf(handler);
    if (index !== -1) actionHandlers.splice(index, 1);
    if (actionHandlers.length === 0) delete channelHandlers[action];
    if (Object.keys(channelHandlers).length === 0) {
      delete this.handlers[channel];
    }
    return this;
  }

  public send(channel: string, action: string, data?: any): void {
    const message: Message = { channel, action, data };
    this.client.send(JSON.stringify(message));
  }

  private emit<C extends keyof H, A extends keyof H[C]>(
    message: Message,
  ): void {
    const { channel, action, data } = message;

    const channelHandlers = this.handlers[channel as C];
    const actionHandlers = channelHandlers?.[action as A];

    if (actionHandlers) {
      actionHandlers.forEach((handler) => handler(data));
    } else {
      console.warn(
        `No handler found for channel: ${channel}, action: ${action}`,
      );
    }
  }

  private parseAndEmit(rawMessage: string): void {
    try {
      const message: Message = JSON.parse(rawMessage);
      if (message.channel && message.action) {
        this.emit(message);
      } else {
        console.warn(
          "Invalid message format: Missing channel or action",
          rawMessage,
        );
      }
    } catch (error) {
      console.error("Failed to parse message:", rawMessage, error);
    }
  }
}
