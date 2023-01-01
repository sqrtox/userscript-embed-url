import { createStyles } from '~/utils/createStyles';
import { insertAfter } from '~/utils/insertAfter';
import { createElement } from '~/utils/createElement';
import { type AnchorEmbedRuleEffectContext } from './AnchorEmbed';

const classNames = createStyles({
  hiddenSpoilerButton: {
    '': {
      display: 'none'
    }
  },
  spoilerButton: {
    '': {
      backgroundColor: '#000',
      color: '#fff',
      padding: '0.5rem',
      cursor: 'pointer'
    }
  }
});

export type SpoilerFactoryContext = Readonly<{
  container: HTMLDivElement,
  onAbort: (listener: () => void) => void;
}>

export type SpoilerFactory = (ctx: SpoilerFactoryContext) => void;

export const createSpoiler = (
  {
    target,
    onAbort,
    rule
  }: AnchorEmbedRuleEffectContext,
  factory: SpoilerFactory
): void => {
  const spoiler = createElement('div');
  const openSpoilerButton = createElement('div',
    {
      attributes: {
        className: classNames.spoilerButton
      }
    },
    `「${rule.name}」を表示する`
  );
  const closeSpoilerButton = createElement('div',
    {
      attributes: {
        className: `${classNames.spoilerButton} ${classNames.hiddenSpoilerButton}`
      }
    },
    `「${rule.name}」を非表示にする`
  );
  const container = document.createElement('div');

  spoiler.append(openSpoilerButton);
  spoiler.append(closeSpoilerButton);
  spoiler.append(container);

  let controller: AbortController | undefined;

  openSpoilerButton.addEventListener('click', ev => {
    ev.stopPropagation();
    openSpoilerButton.classList.add(classNames.hiddenSpoilerButton);
    closeSpoilerButton.classList.remove(classNames.hiddenSpoilerButton);

    factory({
      container,
      onAbort: listener => {
        controller = new AbortController();
        controller.signal.addEventListener('abort', () => listener());
      }
    });
  });
  closeSpoilerButton.addEventListener('click', ev => {
    ev.stopPropagation();
    closeSpoilerButton.classList.add(classNames.hiddenSpoilerButton);
    openSpoilerButton.classList.remove(classNames.hiddenSpoilerButton);
    controller?.abort();
    controller = undefined;
  });

  onAbort(() => {
    spoiler.remove();
  });

  insertAfter(target, spoiler);
};
