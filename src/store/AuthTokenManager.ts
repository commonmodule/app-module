import { EventContainer, EventRecord } from "@commonmodule/ts";
import Store from "./Store.js";

export default class AuthTokenManager<E extends EventRecord = EventRecord>
  extends EventContainer<
    E & { tokenChanged: (token: string | undefined) => void }
  > {
  protected store: Store;

  constructor(storeName: string) {
    super();
    this.store = new Store(storeName);
  }

  public get token(): string | undefined {
    return this.store.get("token");
  }

  public set token(value: string | undefined) {
    value
      ? this.store.setPermanent("token", value)
      : this.store.remove("token");

    this.emit(
      "tokenChanged",
      ...([value] as Parameters<
        (E & { tokenChanged: (token: string | undefined) => void })[
          "tokenChanged"
        ]
      >),
    );
  }
}
