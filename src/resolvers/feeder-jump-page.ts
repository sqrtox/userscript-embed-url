import { type AnchorEmbedResolver } from '~/utils/AnchorEmbed';

export default (): AnchorEmbedResolver => ({
  name: 'Feeder jump page',
  test: {
    hostname: /^www[12]\.x-feeder\.info$/,
    pathname: /^\/jump\.php$/
  },
  effect: ({ searchParams }) => {
    const href = searchParams.get('url');

    if (typeof href !== 'string') {
      return;
    }

    return new URL(href);
  }
});
