import { option } from '~/utils/option';
import { resolveYoutubeId } from '~/utils/resolveYoutubeId';
import { createSpoiler } from '~/utils/createSpoiler';
import { createStyles } from '~/utils/createStyles';
import { createElement } from '~/utils/createElement';
import { type AnchorEmbedRule } from '~/utils/AnchorEmbed';

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
  name: 'YouTube',
  test: {
    hostname: /^(?:www|m)\.youtube\.com|youtu\.be$/
  },
  effect: ctx => {
    const { url } = ctx;
    const id = option(() => resolveYoutubeId(url));

    if (!id) {
      return;
    }

    const src = `https://www.youtube-nocookie.com/embed/${id}`;

    createSpoiler(ctx, ({ onAbort, container }) => {
      container.classList.add(classNames.container);

      const ifr = createElement('iframe', {
        attributes: {
          src,
          title: 'YouTube video player',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowFullscreen: true,
          className: classNames.iframe,
          width: '560',
          height: '315'
        }
      });

      container.append(ifr);
      onAbort(() => ifr.remove());
    });
  }
});
