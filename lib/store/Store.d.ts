export default class Store {
    private readonly prefix;
    private static getStorage;
    static isStorageAvailable(): boolean;
    constructor(name: string);
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