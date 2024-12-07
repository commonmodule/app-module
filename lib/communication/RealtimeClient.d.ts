export default interface RealtimeClinet {
    send(message: string): void;
    on(eventName: "receive", listener: (message: string) => void): void;
}
//# sourceMappingURL=RealtimeClient.d.ts.map