import { JsonValue, KebabCase } from "@common-module/ts";
export default class Store<NT extends string> {
    private readonly prefix;
    constructor(name: KebabCase<NT>);
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
//# sourceMappingURL=Store.d.ts.map