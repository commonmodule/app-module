import { EventContainer } from "@common-module/ts";
export default class ChannelClient extends EventContainer {
    parseAndEmit(rawMessage) {
        const message = JSON.parse(rawMessage);
    }
}
//# sourceMappingURL=ChannelClient.js.map