import { AnchorEmbedRule } from '~/utils/AnchorEmbed';
import { insertAfter } from '~/utils/insertAfter';

const initPinterestScript = (() => {
  let initialized = false;

  return () => {
    if (initialized) {
      return;
    }

    const script = document.createElement('script');

    script.type = 'text/javascript';
    script.async = true;
    script.src = '//assets.pinterest.com/js/pinit.js';

    document.body.append(script);

    initialized = true;
  };
})();

export default (): AnchorEmbedRule => ({
  name: 'Pinterest',
  test: {
    hostname: [
      // www.pinterest.com
      // jp.pinterest.com
      /^(?:www|[a-z]{2})\.pinterest\.com$/,
      // www.pinterest.jp
      /^www\.pinterest\.[a-z]{2}$/
    ],
    pathname: [
      // https://www.pinterest.jp/pin/nnnnn/
      /^\/?pin\/\d+\/?$/,
      // https://www.pinterest.jp/xxxxx/
      /^\/?[^/]+\/?$/,
      // https://www.pinterest.jp/xxxxx/xxxxx/
      /^\/?[^/]+\/[^/]+\/?$/
    ]
  },
  effect: async ({ target, url, onAbort }) => {
    initPinterestScript();

    const container = document.createElement('div');
    const a = document.createElement('a');
    const paths = url.pathname.split('/').filter(v => v);

    a.href = url.href;

    const reject = (() => {
      if (paths.length === 1) {
        a.dataset.pinDo = 'embedUser';
        a.dataset.pinBoardWidth = '400';
        a.dataset.pinScaleHeight = '320';
        a.dataset.pinScaleWidth = '80';

        return false;
      }

      if (paths.length !== 2) {
        return true;
      }

      if (paths[0] === 'pin') {
        a.dataset.pinDo = 'embedPin';

        return false;
      } else {
        a.dataset.pinDo = 'embedBoard';
        a.dataset.pinBoardWidth = '400';
        a.dataset.pinScaleHeight = '240';
        a.dataset.pinScaleWidth = '80';

        return false;
      }
    })();

    if (reject) {
      return;
    }

    container.append(a);

    insertAfter(target, container);
    onAbort(() => container.remove());
  }
});
