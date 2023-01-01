export const findElement = function* <K extends keyof HTMLElementTagNameMap>(tagName: K, context: Document | Element = document): IterableIterator<HTMLElementTagNameMap[K]> {
  if (!(context instanceof Document) && context instanceof document.createElement(tagName).constructor) {
    yield context as HTMLElementTagNameMap[K];
  }

  yield* context.getElementsByTagName(tagName);
};
