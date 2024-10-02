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
        const message = this.messages[language]?.[key];
        if (message === undefined) {
            console.error(`message "${key}" not exists.`);
            return "";
        }
        return message;
    }
}
export default new I18nMessageManager();
//# sourceMappingURL=I18nMessageManager.js.map