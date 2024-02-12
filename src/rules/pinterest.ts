import { AnchorEmbedRule } from '~/utils/AnchorEmbed';
import { createSpoiler } from '~/utils/createSpoiler';

const initPinterestScript = (() => {
  let initialized = false;
  const methodName = `__parsePin${Math.random().toString(36).slice(2)}` as const;

  return () => {
    if (!initialized) {
      const script = document.createElement('script');

      script.type = 'text/javascript';
      script.async = true;
      script.src = '//assets.pinterest.com/js/pinit.js';
      script.dataset.pinBuild = methodName;

      document.body.append(script);

      initialized = true;
    }

    return methodName;
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
  effect: async ctx => {
    const methodName = initPinterestScript();
    const a = document.createElement('a');
    const { target, url } = ctx;
    const paths = url.pathname.split('/').filter(v => v);

    a.href = url.href;

    const reject = (() => {
      if ("pinDo" in target.dataset) {
        return true;
      }

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

    createSpoiler(ctx, async ({ container, onAbort }) => {
      container.append(a);
      console.log(unsafeWindow, unsafeWindow[methodName as any])
      unsafeWindow[methodName as keyof typeof unsafeWindow](container);
      onAbort(() => container.replaceChildren())
    });
  }
});
