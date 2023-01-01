import { createElement } from '~/utils/createElement';
import { findElement } from '~/utils/findElement';

export const wakeScriptTag = (root: Element | Document): void => {
  for (const e of findElement('script', root)) {
    const s = createElement('script', {
      attributes: {
        src: e.src,
        charset: e.charset,
        async: e.async,
        defer: e.defer,
        type: e.type
      }
    });

    e.parentNode?.insertBefore(s, e);
    e.remove();
  }
};
