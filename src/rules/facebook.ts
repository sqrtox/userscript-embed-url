import { createSpoiler } from '~/utils/createSpoiler';
import { createStyles } from '~/utils/createStyles';
import { createElement } from '~/utils/createElement';
import { type AnchorEmbedRule } from '~/utils/AnchorEmbed';

const classNames = createStyles({
  container: {
    '': {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#fff'
    }
  }
});

const initSdk = (() => {
  const initialized = false;

  return () => {
    if (initialized) {
      return;
    }

    const root = createElement('div', {
      attributes: { id: 'fb-root' }
    });
    const script = createElement('script', {
      attributes: {
        async: true,
        defer: true,
        crossOrigin: 'anonymous',
        src: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0'
      }
    });

    document.body.append(root, script);
  };
})();

export default (): AnchorEmbedRule => ({
  name: 'Facebook',
  test: {
    hostname: /^(?:www|m)\.facebook\.com$/,
    pathname: /^\/?[^/]+\/(?:posts|videos)(?:\/[^/]+)?\/[^/]+\/?$/
  },
  effect: ctx => {
    initSdk();

    createSpoiler(ctx, ({ onAbort, container }) => {
      container.classList.add(classNames.container);

      const post = createElement('div');

      post.classList.add('fb-post');
      post.dataset.href = ctx.url.href;
      post.dataset.width = '500';
      post.dataset.showText = 'true';

      container.append(post);
      FB.XFBML.parse();
      onAbort(() => post.remove());
    });
  }
});
