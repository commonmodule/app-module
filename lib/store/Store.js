import { JsonUtils, StringUtils, } from "@common-module/ts";
export default class Store {
    prefix;
    constructor(name) {
        if (!StringUtils.isKebabCase(name)) {
            throw new Error("Name must be in kebab-case format (lowercase and hyphens only).");
        }
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
                location.reload();
            }
            else {
                throw e;
            }
        }
    }
    get(key) {
        const fullKey = this.getFullKey(key);
        const value = sessionStorage.getItem(fullKey) ??
            localStorage.getItem(fullKey);
        if (value === null)
            return undefined;
        try {
            return JsonUtils.parseWithUndefined(value);
        }
        catch (e) {
            console.error(`Failed to parse ${fullKey}: ${value}`);
            console.error(e);
        }
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
                        try {
                            result[parsedKey] = JsonUtils.parseWithUndefined(value);
                        }
                        catch (e) {
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
    isPermanent(key) {
        return localStorage.getItem(this.getFullKey(key)) !== null;
    }
    remove(...keys) {
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
//# sourceMappingURL=Store.js.map