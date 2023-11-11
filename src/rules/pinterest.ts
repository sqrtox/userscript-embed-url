import { AnchorEmbedRule } from '~/utils/AnchorEmbed';
import { createElement } from '~/utils/createElement';
import { createStyles } from '~/utils/createStyles';
import { exoticFetch } from '~/utils/exoticFetch';
import { insertAfter } from '~/utils/insertAfter';

const classNames = createStyles({
  img: {
    '': {
      maxWidth: '90%'
    }
  }
});

export default (): AnchorEmbedRule => ({
  name: 'Pinterest',
  test: {
    hostname: /^(?:www|[a-z]{2})\.pinterest\.com$/,
    pathname: /^\/?pin\/\d+\/?$/
  },
  effect: async ({ target, url, onAbort }) => {
    const { response } = await exoticFetch(url.href, {
      responseType: 'text'
    });
    const container = document.createElement('div');

    const m = response.match(/(i\.pinimg\.com\/.+?\/.+?\/.+?\/.+?\..+?)"/)?.[1];

    if (!m) {
      return;
    }

    const img = createElement('img', {
      attributes: {
        src: `https://${m}`,
        className: classNames.img
      }
    });

    container.append(img);

    insertAfter(target, container);
    onAbort(() => container.remove());
  }
});
