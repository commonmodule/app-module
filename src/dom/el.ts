import {
  ElementOrSelector,
  InferElementType,
  el as UniversalEl,
} from "@common-module/universal-page";
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
