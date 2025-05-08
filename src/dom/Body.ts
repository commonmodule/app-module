import Dom from "./Dom.js";

class Body extends Dom<HTMLBodyElement> {
  constructor() {
    super(document.body as HTMLBodyElement);
  }
}

export default new Body();
