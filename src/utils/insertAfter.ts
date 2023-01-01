export const insertAfter = (target: Node, element: Node): void => {
  const { parentNode, nextSibling } = target;

  if (!parentNode) {
    throw new Error('No parent node');
  }

  if (nextSibling) {
    parentNode.insertBefore(element, nextSibling);
  } else {
    parentNode.append(element);
  }
};
