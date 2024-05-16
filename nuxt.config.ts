// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},
  app: {
    head: {
      title: "CC Compiler",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { key: 'og:title', property: 'og:title', content: 'CC Compiler' },
        { key: 'og:description', property: 'og:description', content: 'CC Compiler - A custom compiler project for HEPIA students to compile C-like for their own processor.' },
        { key: 'og:image', property: 'og:image', content: '/favicon.ico' },
        { key: 'og:url', property: 'og:url', content: 'https://cc-compiler.canardconfit.ch' },
        { key: 'og:type', property: 'og:type', content: 'website' },
        { key: 'twitter:title', name: 'twitter:title', content: 'CC Compiler' },
        { key: "twitter:domain", property: "twitter:domain", content: "cc-compiler.canardconfit.ch" },
        { key: "twitter:url", property: "twitter:url", content: "https://cc-compiler.canardconfit.ch" },
        { key: 'twitter:description', name: 'twitter:description', content: 'CC Compiler - A custom compiler project for HEPIA students to compile C-like for to create their own processor.' },
        { key: 'twitter:image', name: 'twitter:image', content: '/favicon.ico' },
        { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      ],
    }
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@/assets/style.css",
  ],
  modules: ["nuxt-monaco-editor"],
});
