// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 3002,
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "@sidebase/nuxt-auth",
    "nuxt-tiptap-editor",
  ],
  css: ["~/assets/css/global.css"],
  app: {
    head: {
      title: "Homie - Cari Kosan Secepat Kilat",
      titleTemplate: "%s - Homie",
      link: [
        {
          href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
          rel: "stylesheet",
        },
        {
          href: "https://fonts.googleapis.com",
          rel: "preconnect",
        },
        {
          href: "https://fonts.gstatic.com",
          rel: "preconnect",
          crossorigin: "use-credentials",
        },
      ],
    },
  },
  auth: {
    baseURL: "http://localhost:3002",
    provider: {
      type: "authjs",
    },
    globalAppMiddleware: false,
  },
  runtimeConfig: {
    public: {
      mapBoxApi: "",
    },
  },
  colorMode: {
    preference: "light",
  },
  eslint: {},
});
