import { createSpoiler } from '~/utils/createSpoiler';
import { createStyles } from '~/utils/createStyles';
import { createElement } from '~/utils/createElement';
import { type AnchorEmbedRule } from '~/utils/AnchorEmbed';
import { exoticFetch } from '~/utils/exoticFetch';

type InstagramOEmbedResponse = {
  author_id: number,
  author_name: string,
  author_url: string,
  height: null | number,
  html: string,
  media_id: string,
  provider_name: string,
  provider_url: string,
  thumbnail_height: number,
  thumbnail_url: string,
  thumbnail_width: number,
  title: string,
  type: string,
  version: string,
  width: number
}

const classNames = createStyles({
  container: {
    '': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#000'
    }
  },
  wrapper: {
    '': {
      width: '100%'
    }
  }
});

declare const instgrm: {
  Embeds: {
    process: () => void
  }
};

const initScript = (() => {
  const initialized = false;

  return () => {
    if (initialized) {
      return;
    }

    const script = createElement('script', {
      attributes: {
        async: true,
        src: 'https://www.instagram.com/embed.js'
      }
    });

    document.body.append(script);
  };
})();

export default (): AnchorEmbedRule => ({
  name: 'Instagram',
  test: {
    hostname: /^(?:www|m)\.instagram\.com$/,
    pathname: /^\/?p\/[^/]+\/?$/
  },
  effect: ctx => {
    initScript();

    createSpoiler(ctx, async ({ onAbort, container }) => {
      container.classList.add(classNames.container);

      const wrapper = createElement('div', {
        attributes: {
          className: classNames.wrapper
        }
      });

      onAbort(() => wrapper.remove());

      const url = new URL('https://www.instagram.com/api/v1/oembed/');

      url.searchParams.append('hidecaption', '0');
      url.searchParams.append('maxwidth', '540');
      url.searchParams.append('url', ctx.url.href);

      const { response } = await exoticFetch<InstagramOEmbedResponse, 'json'>(url.href, {
        responseType: 'json'
      });

      wrapper.innerHTML = response.html;

      container.append(wrapper);
      instgrm.Embeds.process();
    });
  }
});
