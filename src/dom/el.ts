import { ElFunction } from "@common-module/universal-page";
import DomNode, {
  DomChild,
  ElementOrSelector,
  InferElementType,
} from "./DomNode.js";

const el: ElFunction<DomNode<InferElementType<ElementOrSelector>>> = function (
  elementOrSelector: ElementOrSelector,
  ...children: DomChild<ElementOrSelector>[]
): DomNode<InferElementType<ElementOrSelector>> {
  return new DomNode(elementOrSelector, ...children);
};

export default el;
