// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/image'
  ],

  imports: {
    dirs: ['composables/**']
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  devServer: {
    host: '0.0.0.0'
  },

  compatibilityDate: '2026-06-30',

  vite: {
    server: {
      allowedHosts: [
        'portail.maelbelliard.fr'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
