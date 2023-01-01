import { type AnchorEmbedRule } from '~/utils/AnchorEmbed';
import { createSpoiler } from '~/utils/createSpoiler';
import { createStyles } from '~/utils/createStyles';
import { createElement } from '~/utils/createElement';

const classNames = createStyles({
  iframe: {
    '': {
      border: 'none',
      maxWidth: '100%'
    }
  },
  container: {
    '': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#000'
    }
  }
});

export default (): AnchorEmbedRule => ({
  name: 'ニコニコ動画',
  test: {
    hostname: /^(?:www|sp)\.nicovideo\.jp$/,
    pathname: /^\/watch\/sm\d+$/
  },
  effect: ctx => {
    const src = `https://embed.nicovideo.jp${ctx.url.pathname}`;

    createSpoiler(ctx, ({ onAbort, container }) => {
      container.classList.add(classNames.container);

      const ifr = createElement('iframe', {
        attributes: {
          src,
          allowFullscreen: true,
          className: classNames.iframe
        }
      });

      container.append(ifr);

      onAbort(() => ifr.remove());
    });
  }
});
