// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {enabled: true},
  app: {
    head: {
      meta: [
        {charset: 'utf-8'},
        {name: 'viewport', content: 'width=device-width, initial-scale=1'}
      ],
    }
  },
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "@/assets/style.css",
  ],
  modules: ["nuxt-monaco-editor"],
});
