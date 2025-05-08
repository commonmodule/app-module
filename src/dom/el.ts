import {
  el as UniversalEl,
  ElementOrSelector,
  html,
  InferElementType,
} from "@commonmodule/universal-page";
import Dom, { DomChild } from "./Dom.js";

export default function el<EOS extends ElementOrSelector = HTMLElement>(
  elementOrSelector: EOS,
  ...children: DomChild<EOS>[]
): Dom<InferElementType<EOS>> {
  return new Dom(elementOrSelector, ...children) as Dom<
    InferElementType<EOS>
  >;
}

UniversalEl.impl = el;

html.impl = (htmlContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  return new Dom(doc.body.firstChild as HTMLElement);
};
