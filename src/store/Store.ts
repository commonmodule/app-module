import { JsonUtil, JsonValue } from "@common-module/ts";

export class Store {
  private readonly prefix: string;

  constructor(name: string) {
    this.prefix = `${name}/`;
  }

  private getStorage(permanent: boolean): Storage {
    return permanent ? localStorage : sessionStorage;
  }

  private getFullKey(key: string): string {
    return this.prefix + key;
  }

  private static isQuotaExceededError(e: unknown): boolean {
    return e instanceof DOMException && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === "QuotaExceededError" ||
      e.name === "NS_ERROR_DOM_QUOTA_REACHED"
    );
  }

  public set(key: string, value: JsonValue, permanent = false): void {
    const storage = this.getStorage(permanent);
    const fullKey = this.getFullKey(key);

    try {
      storage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      if (Store.isQuotaExceededError(e)) {
        storage.clear();
        storage.setItem(fullKey, JSON.stringify(value));
      } else {
        throw e;
      }
    }
  }

  public get<T extends JsonValue>(key: string): T | undefined {
    const fullKey = this.getFullKey(key);
    const value = sessionStorage.getItem(fullKey) ||
      localStorage.getItem(fullKey);

    return value === null ? undefined : JsonUtil.parseWithUndefined<T>(value);
  }

  public getAll<T extends JsonValue>(): Record<string, T> {
    const result: Record<string, T> = {};

    const processStorage = (storage: Storage) => {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(this.prefix)) {
          const value = storage.getItem(key);
          if (value !== null) {
            const parsedKey = key.slice(this.prefix.length);
            result[parsedKey] = JsonUtil.parseWithUndefined<T>(value);
          }
        }
      }
    };

    processStorage(sessionStorage);
    processStorage(localStorage);

    return result;
  }

  public isPermanent(key: string): boolean {
    return localStorage.getItem(this.getFullKey(key)) !== null;
  }

  public delete(...keys: string[]): void {
    keys.forEach((key) => {
      const fullKey = this.getFullKey(key);
      sessionStorage.removeItem(fullKey);
      localStorage.removeItem(fullKey);
    });
  }

  public clear(): void {
    [sessionStorage, localStorage].forEach((storage) => {
      for (let i = storage.length - 1; i >= 0; i--) {
        const key = storage.key(i);
        if (key?.startsWith(this.prefix)) {
          storage.removeItem(key);
        }
      }
    });
  }
}

export default Store;
