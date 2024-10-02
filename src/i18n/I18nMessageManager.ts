type MessageDictionary = { [key: string]: string };
type LanguageDictionary = { [language: string]: MessageDictionary };

class I18nMessageManager {
  private messages: LanguageDictionary = {};

  public addMessage(language: string, key: string, message: string): void {
    if (!this.messages[language]) {
      this.messages[language] = {};
    }
    this.messages[language][key] = message;
  }

  public addMessages(language: string, messages: MessageDictionary): void {
    if (!this.messages[language]) {
      this.messages[language] = {};
    }
    this.messages[language] = { ...this.messages[language], ...messages };
  }

  public addMessagesBulk(messages: LanguageDictionary): void {
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

  public getMessage(language: string, key: string): string {
    const message = this.messages[language]?.[key];
    if (message === undefined) {
      console.error(`message "${key}" not exists.`);
      return "";
    }
    return message;
  }
}

export default new I18nMessageManager();
