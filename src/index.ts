import { AnchorEmbed } from '~/utils/AnchorEmbed';
import imgurRule from '~/rules/imgur';
import feederJumpPageResolver from '~/resolvers/feeder-jump-page';
import youtubeRule from '~/rules/youtube';
import nicovideoRule from '~/rules/nicovideo';
import twitterRule from '~/rules/twitter';

const anchorEmbed = new AnchorEmbed({
  rules: [
    imgurRule(),
    youtubeRule(),
    nicovideoRule(),
    twitterRule()
  ],
  resolvers: [
    feederJumpPageResolver()
  ]
});

anchorEmbed.apply();
