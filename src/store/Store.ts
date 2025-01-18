import { JsonUtils, KebabCase, StringUtils } from "@common-module/ts";

export default class Store<NT extends string> {
  private readonly prefix: string;

  private static getStorage(permanent: boolean): Storage {
    return permanent ? localStorage : sessionStorage;
  }

  public static isStorageAvailable() {
    try {
      const testKey = "__test__";
      sessionStorage.setItem(testKey, "test");
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  constructor(name: KebabCase<NT>) {
    if (!StringUtils.isKebabCase(name)) {
      throw new Error(
        "Name must be in kebab-case format (lowercase and hyphens only).",
      );
    }
    this.prefix = `${name}/`;
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

  private setValue<T>(key: string, value: T, permanent: boolean): void {
    const storage = Store.getStorage(permanent);
    const fullKey = this.getFullKey(key);

    try {
      storage.setItem(fullKey, JSON.stringify(value));
    } catch (e) {
      if (Store.isQuotaExceededError(e)) {
        storage.clear();

        // after clearing the storage, the page should be reloaded
        location.reload();
      } else {
        throw e;
      }
    }
  }

  public setTemporary<T>(key: string, value: T): void {
    this.setValue(key, value, false);
  }

  public setPermanent<T>(key: string, value: T): void {
    this.setValue(key, value, true);
  }

  public get<T>(key: string): T | undefined {
    const fullKey = this.getFullKey(key);
    const value = sessionStorage.getItem(fullKey) ??
      localStorage.getItem(fullKey);

    if (value === null) return undefined;

    try {
      return JsonUtils.parseWithUndefined<T>(value);
    } catch (e) {
      console.error(`Failed to parse ${fullKey}: ${value}`);
      console.error(e);
    }
  }

  public getAll<T>(): Record<string, T> {
    const result: Record<string, T> = {};

    const processStorage = (storage: Storage) => {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key?.startsWith(this.prefix)) {
          const value = storage.getItem(key);
          if (value !== null) {
            const parsedKey = key.slice(this.prefix.length);

            try {
              result[parsedKey] = JsonUtils.parseWithUndefined<T>(value);
            } catch (e) {
              console.error(`Failed to parse ${key}: ${value}`);
              console.error(e);
            }
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

  public remove(...keys: string[]): void {
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
