import DomNode, { DomChild } from "./DomNode.js";
import DomSelector from "./DomSelector.js";

export default function el<HE extends HTMLElement>(
  htmlElement?: HE | DomSelector,
  ...children: DomChild<HE>[]
): DomNode<HE> {
  return new DomNode<HE>(htmlElement, ...children);
}
