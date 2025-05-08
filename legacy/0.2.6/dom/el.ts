import {
  el as UniversalEl,
  ElementOrSelector,
  html,
  InferElementType,
} from "@commonmodule/universal-page";
import DomNode, { DomChild } from "./DomNode.js";

export default function el<EOS extends ElementOrSelector = HTMLElement>(
  elementOrSelector: EOS,
  ...children: DomChild<EOS>[]
): DomNode<InferElementType<EOS>> {
  return new DomNode(elementOrSelector, ...children) as DomNode<
    InferElementType<EOS>
  >;
}

UniversalEl.impl = el;

html.impl = (htmlContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  return new DomNode(doc.body.firstChild as HTMLElement);
};
