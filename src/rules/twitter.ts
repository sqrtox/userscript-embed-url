import { type AnchorEmbedRule } from '~/utils/AnchorEmbed';
import { createElement } from '~/utils/createElement';
import { exoticFetch } from '~/utils/exoticFetch';
import { findElement } from '~/utils/findElement';
import { wakeScriptTag } from '~/utils/wakeScriptTag';
import { createSpoiler } from '../utils/createSpoiler';

export type TwitterOEmbedResponse = Readonly<{
  author_name: string,
  author_url: string,
  cache_age: string,
  height: null | number,
  html: string,
  provider_name: string,
  provider_url: string,
  type: string,
  url: string,
  version: string,
  width: number
}>;

export default (): AnchorEmbedRule => ({
  name: 'Twitter',
  test: {
    hostname: /^twitter\.com$/,
    pathname: /^\/[^/]+\/status\/\d+/
  },
  effect: async ctx => {
    const { url, anchorEmbed } = ctx;

    createSpoiler(ctx, async ({ onAbort, container }) => {
      const wrapper = createElement('div');

      onAbort(() => wrapper.remove());

      const { response } = await exoticFetch<TwitterOEmbedResponse, 'json'>(
        `https://publish.twitter.com/oembed?url=${url.href}`,
        {
          responseType: 'json'
        }
      );

      wrapper.innerHTML = response.html;

      for (const e of findElement('a', wrapper)) {
        anchorEmbed.exclude(e);
      }

      container.append(wrapper);

      wakeScriptTag(wrapper);
    });
  }
});
