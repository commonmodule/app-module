import { JsonValue } from "@common-module/ts";
export declare class Store {
    private readonly prefix;
    constructor(name: string);
    private getStorage;
    private getFullKey;
    private static isQuotaExceededError;
    set(key: string, value: JsonValue, permanent?: boolean): void;
    get<T extends JsonValue>(key: string): T | undefined;
    getAll<T extends JsonValue>(): Record<string, T>;
    isPermanent(key: string): boolean;
    delete(...keys: string[]): void;
    clear(): void;
}
export default Store;
//# sourceMappingURL=Store.d.ts.map