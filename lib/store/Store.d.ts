import { JsonValue, KebabCase } from "@common-module/ts";
export default class Store<NT extends string> {
    private readonly prefix;
    constructor(name: KebabCase<NT>);
    private getStorage;
    private getFullKey;
    private static isQuotaExceededError;
    private setValue;
    setTemporary(key: string, value: JsonValue): void;
    setPermanent(key: string, value: JsonValue): void;
    get<T extends JsonValue>(key: string): T | undefined;
    getAll<T extends JsonValue>(): Record<string, T>;
    isPermanent(key: string): boolean;
    remove(...keys: string[]): void;
    clear(): void;
}
//# sourceMappingURL=Store.d.ts.map