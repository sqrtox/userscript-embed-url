import { createElement } from '~/utils/createElement';
import { createStyles } from '~/utils/createStyles';

const classNames = createStyles({
  cover: {
    '': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      zIndex: '999999',
      backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
  },
  coverHidden: {
    '': {
      display: 'none'
    }
  },
  noScroll: {
    '': {
      overflow: 'hidden !important'
    }
  },
  coverImg: {
    '': {
      maxWidth: '50vw'
    }
  }
});

const cover = createElement('div', {
  attributes: {
    className: `${classNames.cover} ${classNames.coverHidden}`
  }
});

cover.addEventListener('click', () => {
  document.documentElement.classList.remove(classNames.noScroll);
  cover.classList.add(classNames.coverHidden);
});

document.body.append(cover);

export const createThumbnail = (src: string): HTMLImageElement => {
  const img = createElement('img', {
    attributes: {
      src
    }
  });

  img.addEventListener('click', ev => {
    ev.stopPropagation();
    document.documentElement.classList.add(classNames.noScroll);
    cover.classList.remove(classNames.coverHidden);

    while (cover.firstChild) {
      cover.firstChild.remove();
    }

    const coverImg = createElement('img', {
      attributes: {
        src: img.src,
        className: classNames.coverImg
      }
    });

    cover.append(coverImg);
  });

  return img;
};
