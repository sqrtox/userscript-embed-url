import { type AnchorEmbedResolver } from '~/utils/AnchorEmbed';

export default (): AnchorEmbedResolver => ({
  name: 'X to Twitter',
  test: {
    hostname: /^x\.com$/
  },
  effect: url => {
    const cloned = new URL(url);

    cloned.hostname = 'twitter.com';

    return cloned;
  }
});
