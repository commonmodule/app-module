import { ElementOrSelector, InferElementType } from "@commonmodule/universal-page";
import Dom, { DomChild } from "./Dom.js";
export default function el<EOS extends ElementOrSelector = HTMLElement>(elementOrSelector: EOS, ...children: DomChild<EOS>[]): Dom<InferElementType<EOS>>;
//# sourceMappingURL=el.d.ts.map