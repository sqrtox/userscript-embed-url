import { type AnchorEmbedRule } from '~/utils/AnchorEmbed';
import { createStyles } from '~/utils/createStyles';
import { createThumbnail } from '~/utils/createThumbnail';
import { exoticFetch } from '~/utils/exoticFetch';
import { insertAfter } from '~/utils/insertAfter';
import { createElement } from '~/utils/createElement';
import { createSpoiler } from '~/utils/createSpoiler';

const classNames = createStyles({
  img: {
    '': {
      maxWidth: '90%'
    }
  },
  video: {
    '': {
      maxWidth: '100%'
    }
  }
});

export default (): AnchorEmbedRule => ({
  name: 'Imgur',
  test: {
    hostname: /^i\.imgur\.com$/
  },
  effect: async ctx => {
    const { target, onAbort, url, anchorEmbed } = ctx;
    const { response } = await exoticFetch(url.href);
    const container = document.createElement('div');

    switch (response.type.replace(/\/.+$/, '')) {
      case 'image': {
        const img = createThumbnail(url.href);

        img.classList.add(classNames.img);

        container.append(img);

        break;
      }

      case 'video': {
        createSpoiler(ctx, ({ onAbort, container }) => {
          const video = createElement('video', {
            attributes: {
              src: url.href,
              controls: true,
              className: classNames.video
            }
          });

          container.append(video);

          onAbort(() => video.remove());
        });

        break;
      }

      default: {
        if (response.type !== 'text/html') {
          break;
        }

        const text = await response.text();
        const m = text.match(/<meta\s+property="og:image"\s+data-react-helmet="true"\s+content="(.+?)">/);

        if (!m) {
          break;
        }

        const url = new URL(m[1]);

        url.search = '';

        anchorEmbed.destroyRule(target);
        anchorEmbed.applyRule(target, url.href);

        break;
      }
    }

    if (container.children.length) {
      insertAfter(target, container);
      onAbort(() => container.remove());
    }
  }
});
