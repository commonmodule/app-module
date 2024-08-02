export type DomSelectorKey = keyof HTMLElementTagNameMap;
type DomSelector = "" | DomSelectorKey | `${DomSelectorKey}#${string}` | `${DomSelectorKey}.${string}` | `${DomSelectorKey}#${string}.${string}`;
export default DomSelector;
//# sourceMappingURL=DomSelector.d.ts.map