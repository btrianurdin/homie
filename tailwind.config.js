import { Config } from "tailwindcss";
import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";

/**
 * @type {Config}
 */
const config = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    iconsPlugin({
      collections: getIconCollections(["lucide", "heroicons"]),
    }),
  ],
};

export default config;
