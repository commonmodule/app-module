import DomNode from "../dom/DomNode.js";
interface InvisibleFileInputOptions {
    multiple?: boolean;
    accept?: string;
}
export default class InvisibleFileInput extends DomNode<HTMLInputElement> {
    constructor(options: InvisibleFileInputOptions);
    openFileSelector(): void;
}
export {};
//# sourceMappingURL=InvisibleFileInput.d.ts.map