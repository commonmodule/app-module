import { EventContainer, EventHandlers } from "@commonmodule/ts";
import Store from "./Store.js";
export default class AuthTokenManager<E extends EventHandlers = {}> extends EventContainer<E & {
    tokenChanged: (token: string | undefined) => void;
}> {
    protected store: Store;
    constructor(storeName: string);
    get token(): string | undefined;
    set token(value: string | undefined);
}
//# sourceMappingURL=AuthTokenManager.d.ts.map