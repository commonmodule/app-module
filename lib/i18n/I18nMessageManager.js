class I18nMessageManager {
    messages = {};
    addMessage(language, key, message) {
        if (!this.messages[language]) {
            this.messages[language] = {};
        }
        this.messages[language][key] = message;
    }
    addMessages(language, messages) {
        if (!this.messages[language]) {
            this.messages[language] = {};
        }
        this.messages[language] = { ...this.messages[language], ...messages };
    }
    addMessagesBulk(messages) {
        for (const [language, messageDictionary] of Object.entries(messages)) {
            if (!this.messages[language]) {
                this.messages[language] = {};
            }
            this.messages[language] = {
                ...this.messages[language],
                ...messageDictionary,
            };
        }
    }
    getMessage(language, key) {
        const path = key.split(".");
        let current = this.messages[language];
        if (!current) {
            console.error(`Language "${language}" not exists.`);
            return "";
        }
        for (const segment of path) {
            if (current[segment] === undefined) {
                console.error(`Message key "${key}" not exists in language "${language}".`);
                return "";
            }
            current = current[segment];
        }
        if (typeof current !== "string") {
            console.error(`The value for "${key}" is not a string.`);
            return "";
        }
        return current;
    }
}
export default new I18nMessageManager();
//# sourceMappingURL=I18nMessageManager.js.map