import DomNode, {
  DomChild,
  ElementOrSelector,
  InferElementType
} from "./DomNode.js";

export default function el<EOS extends ElementOrSelector = HTMLElement>(
  elementOrSelector: EOS,
  ...children: DomChild<EOS>[]
): DomNode<InferElementType<EOS>> {
  return new DomNode(elementOrSelector, ...children) as DomNode<
    InferElementType<EOS>
  >;
}
