import { AnchorEmbed } from "~/utils/AnchorEmbed";
import imgurRule from "~/rules/imgur";
import feederJumpPageResolver from "~/resolvers/feeder-jump-page";
import net5chJumpPageResolver from "~/resolvers/net5ch-feeder-jump-page";
import youtubeRule from "~/rules/youtube";
import nicovideoRule from "~/rules/nicovideo";
import twitterRule from "~/rules/twitter";
import xToTwitterResolver from "~/resolvers/x-to-twitter";
import facebookRule from "~/rules/facebook";
import instagramRule from "~/rules/instagram";
import pinterestRule from "~/rules/pinterest";

const anchorEmbed = new AnchorEmbed({
  rules: [
    imgurRule(),
    youtubeRule(),
    nicovideoRule(),
    twitterRule(),
    facebookRule(),
    instagramRule(),
    pinterestRule(),
  ],
  resolvers: [
    feederJumpPageResolver(),
    net5chJumpPageResolver(),
    xToTwitterResolver(),
  ],
});

anchorEmbed.apply();
