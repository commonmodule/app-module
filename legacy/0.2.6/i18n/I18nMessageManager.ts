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
    const path = key.split(".");
    let current: any = this.messages[language];
    if (!current) {
      console.error(`Language "${language}" not exists.`);
      return "";
    }
    for (const segment of path) {
      if (current[segment] === undefined) {
        console.error(
          `Message key "${key}" not exists in language "${language}".`,
        );
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
