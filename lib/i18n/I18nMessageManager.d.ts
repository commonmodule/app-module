type MessageDictionary = {
    [key: string]: string;
};
type LanguageDictionary = {
    [language: string]: MessageDictionary;
};
declare class I18nMessageManager {
    private messages;
    addMessage(language: string, key: string, message: string): void;
    addMessages(language: string, messages: MessageDictionary): void;
    addMessagesBulk(messages: LanguageDictionary): void;
    getMessage(language: string, key: string): string;
}
declare const _default: I18nMessageManager;
export default _default;
//# sourceMappingURL=I18nMessageManager.d.ts.map