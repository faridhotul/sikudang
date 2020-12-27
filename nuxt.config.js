import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - sikudang',
    title: 'sikudang',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // Simple usage
    '@nuxtjs/date-fns',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
    'nuxt-socket-io',
  ],
  io: {
    // module options
    sockets: [
      {
        name: 'main',
      },
    ],
  },
  router: {
    middleware: ['auth'],
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    proxy: true,
    proxyHeaders: false,
  },
  server: {
    port: 3000, // default: 3000
    host: '127.0.0.1', // default: localhost
  },
  proxy: {
    '/api/': { target: 'http://localhost:4000', pathRewrite: { '^/api/': '' } },
    '/ws/': {
      target: 'http://localhost:4000',
      pathRewrite: { '^/ws/': '/socket.io/' },
      ws: true,
      changeOrigin: true,
      proxyHeaders: false,
    },
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/api/login',
            method: 'post',
            propertyName: 'values',
          },
          logout: null,
          user: {
            url: '/api/profile',
            method: 'get',
            propertyName: 'values',
          },
        },
        tokenType: '',
      },
    },
    redirect: {
      login: '/login',
      logout: '/',
      user: '/',
    },
  },
  pwa: {
    manifest: {
      name: 'Sikudang: Sistem Suku Cadang',
      short_name: 'Sikudang',
      theme_color: '#ffffff',
      author: 'Faridhotul',
    },
    icon: {
      fileName: 'sikudang-icon.png',
    },
  },
  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
