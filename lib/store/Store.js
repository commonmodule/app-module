import { JsonUtil } from "@common-module/ts";
export class Store {
    prefix;
    constructor(name) {
        this.prefix = `${name}/`;
    }
    getStorage(permanent) {
        return permanent ? localStorage : sessionStorage;
    }
    getFullKey(key) {
        return this.prefix + key;
    }
    static isQuotaExceededError(e) {
        return e instanceof DOMException && (e.code === 22 ||
            e.code === 1014 ||
            e.name === "QuotaExceededError" ||
            e.name === "NS_ERROR_DOM_QUOTA_REACHED");
    }
    set(key, value, permanent = false) {
        const storage = this.getStorage(permanent);
        const fullKey = this.getFullKey(key);
        try {
            storage.setItem(fullKey, JSON.stringify(value));
        }
        catch (e) {
            if (Store.isQuotaExceededError(e)) {
                storage.clear();
                storage.setItem(fullKey, JSON.stringify(value));
            }
            else {
                throw e;
            }
        }
    }
    get(key) {
        const fullKey = this.getFullKey(key);
        const value = sessionStorage.getItem(fullKey) ||
            localStorage.getItem(fullKey);
        return value === null ? undefined : JsonUtil.parseWithUndefined(value);
    }
    getAll() {
        const result = {};
        const processStorage = (storage) => {
            for (let i = 0; i < storage.length; i++) {
                const key = storage.key(i);
                if (key?.startsWith(this.prefix)) {
                    const value = storage.getItem(key);
                    if (value !== null) {
                        const parsedKey = key.slice(this.prefix.length);
                        result[parsedKey] = JsonUtil.parseWithUndefined(value);
                    }
                }
            }
        };
        processStorage(sessionStorage);
        processStorage(localStorage);
        return result;
    }
    isPermanent(key) {
        return localStorage.getItem(this.getFullKey(key)) !== null;
    }
    delete(...keys) {
        keys.forEach((key) => {
            const fullKey = this.getFullKey(key);
            sessionStorage.removeItem(fullKey);
            localStorage.removeItem(fullKey);
        });
    }
    clear() {
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
//# sourceMappingURL=Store.js.map