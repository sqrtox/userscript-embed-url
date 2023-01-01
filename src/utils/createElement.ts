export type Props<K extends keyof HTMLElementTagNameMap> = Readonly<Partial<{
  attributes: Partial<HTMLElementTagNameMap[K]>
}>>

export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  {
    attributes = {}
  }: Props<K> = {},
  ...children: readonly (string | Node)[]
): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tagName);

  for (const k in attributes) {
    const v = attributes[k];

    if (!v) {
      continue;
    }

    e[k] = v;
  }

  for (const child of children) {
    e.append(child);
  }

  return e;
};
