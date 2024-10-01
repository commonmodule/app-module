import { KebabCase } from "@common-module/ts";
export default class Store<NT extends string> {
    private readonly prefix;
    constructor(name: KebabCase<NT>);
    private getStorage;
    private getFullKey;
    private static isQuotaExceededError;
    private setValue;
    setTemporary<T>(key: string, value: T): void;
    setPermanent<T>(key: string, value: T): void;
    get<T>(key: string): T | undefined;
    getAll<T>(): Record<string, T>;
    isPermanent(key: string): boolean;
    remove(...keys: string[]): void;
    clear(): void;
}
//# sourceMappingURL=Store.d.ts.map