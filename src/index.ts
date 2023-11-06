import { AnchorEmbed } from '~/utils/AnchorEmbed';
import imgurRule from '~/rules/imgur';
import feederJumpPageResolver from '~/resolvers/feeder-jump-page';
import youtubeRule from '~/rules/youtube';
import nicovideoRule from '~/rules/nicovideo';
import twitterRule from '~/rules/twitter';
import xToTwitterResolver from '~/resolvers/x-to-twitter';
import facebookRule from '~/rules/facebook';
import instagramRule from '~/rules/instagram';

const anchorEmbed = new AnchorEmbed({
  rules: [
    imgurRule(),
    youtubeRule(),
    nicovideoRule(),
    twitterRule(),
    facebookRule(),
    instagramRule()
  ],
  resolvers: [
    feederJumpPageResolver(),
    xToTwitterResolver()
  ]
});

anchorEmbed.apply();
