import type { AnchorEmbedResolver } from "~/utils/AnchorEmbed";

export default (): AnchorEmbedResolver => ({
  name: "5ch jump page",
  test: {
    hostname: /^jump\.5ch\.net$/,
  },
  effect: ({ search }) => {
    const href = search.slice(1);

    if (typeof href !== "string" || !href) {
      return;
    }

    return new URL(href);
  },
});
