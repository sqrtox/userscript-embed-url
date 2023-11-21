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
    pathname: [
      // https://www.facebook.com/watch/?v=nnnnn
      /^\/?watch\/?$/,
      // https://www.facebook.com/xxxxx/videos/nnnnn/
      // https://www.facebook.com/xxxxx/posts/xxxxx
      /^\/?[^/]+\/(?:posts|videos)(?:\/[^/]+)?\/[^/]+\/?$/,
      // https://www.facebook.com/photo/?fbid=nnnnn&set=xxxxx&idorvanity=nnnnn
      /^\/?photo\/?$/
    ]
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
