export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'admin หวยหงส์ฟ้า',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', sizes:'32x32', href: '/favicon.png' },
      { rel: 'icon', type: 'image/x-icon', sizes:'512x512', href: '/favicon.png' },
      { rel: 'apple-touch-icon', type: 'image/x-icon', sizes:'32x32', href: '/favicon.png' },
      { rel: 'apple-touch-icon', type: 'image/x-icon', sizes:'512x512', href: '/favicon.png' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/main.css',
  ],

  tailwindcss: {
    cssPath: '~/assets/sass/_tailwind.scss',
    jit: true,
    exposeConfig: true,
  },

  styleResources: {
    scss: [
      '~/assets/sass/custom.scss',
      '~/assets/sass/app.scss',
      '~/assets/sass/datepicker.scss',
    ],
  },
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/vue-js-modal.js', mode: 'client' },
    { src: '~/plugins/main.js', mode: 'client' },
    // {src: '~/plugins/vue-modal.js', ssr: true},
    { src: '~/plugins/velocity.js', mode: 'client' },
    { src: '~/plugins/cash-dom.js', mode: 'client' },
    { src: '~/plugins/vue-feather-icons.js' },
    { src: '~/plugins/vue-tippy.js', mode: 'client' },
    { src: '~/plugins/vue-good-table.js', mode: 'client' },
    { src: '~/plugins/cookies.js', mode: 'client' },
    { src: '~/plugins/vue-tailwind.js', mode: 'client' },
    {src: '~/plugins/maz-ui.js',mode: 'client'},
    {src: '~/plugins/vuelidate.js', mode: 'client'},
    { src: '~/plugins/chart.js', mode: 'client' },
    { src: '~/plugins/vuex.js', mode: 'client' },
    // { src: '~/plugins/vue2-datepicker.js', mode: 'client' },
    // { src: '~/plugins/vee-validate.js', mode: 'client' },
    // { src: '~/plugins/vue-select.js', mode: 'client' },
    // { src: '~/plugins/vue-autosuggest.js', mode: 'client' },
    { src: '~/plugins/vue-loading.js', mode: 'client' },
    { src: '~/plugins/jsonwebtoken.js', mode: 'client' },
    { src: '~/plugins/vuex-persistedstate.js',  mode: 'client' }
    // { src: '~/plugins/vue-clipboard.js', mode: 'client' },
    // { src: '~/plugins/vue-editor.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // '@nuxt/typescript-build',
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'vue-sweetalert2/nuxt',
    '@nuxtjs/auth-next',
    '@nuxtjs/toast',
    '@nuxtjs/dayjs'
  ],


  // axios: {
  //   // baseURL: `https://lottery-api-dev-u4e5yomraa-as.a.run.app/api/v1/`,
  //   // baseURL: process.env.BASE_URL_API || `https://lottery-api-prod-gye6ncwdlq-as.a.run.app/api/v1/`,
  //   // baseURL: process.env.BASE_URL_API === 'dev' ? `https://lottery-api-dev-gye6ncwdlq-as.a.run.app/api/v1/` : `https://lottery-api-prod-gye6ncwdlq-as.a.run.app/api/v1/`,

  //   baseURL:  process.env.BASE_URL_API || `https://lottery-api-prod-gye6ncwdlq-as.a.run.app/api/v1/`,
  //   https: true,
  //   progress: false
  // },
 axios: {	
    // baseURL: `https://lottery-api-dev-u4e5yomraa-as.a.run.app/api/v1/`,	
    // baseURL: process.env.BASE_URL_API || `https://lottery-api-prod-gye6ncwdlq-as.a.run.app/api/v1/`, 	
    // baseURL: process.env.RUN_MODE === 'dev' ? `https://lottery-api-dev-gye6ncwdlq-as.a.run.app/api/v1/` : `https://lottery-api-prod-gye6ncwdlq-as.a.run.app/api/v1/`,	
    baseURL: process.env.BASE_URL_API || `https://lottery-api-prod-gye6ncwdlq-as.a.run.app/api/v1/`,	
    https: true,	
    progress: false	
  },
  auth: {
    redirect: {
      login: '/login'
    },
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      }
  },
    strategies: {
      localStorage: false,
      local: {
        scheme: 'refresh',
        token: {
          property: 'accessToken'
        },
        refreshToken: {
          property: 'refreshToken',
          data: 'refresh_token',
          maxAge: 60 * 60 * 2
        },
        endpoints: {
          login: {
              url: 'admin/login',
              method: 'post'
          },
          user: false,
          logout: false,
        },
      }
    },
},

router: {
  middleware: ['auth']
},

content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel:{
      plugins: [
        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
        [
          'component', {
            libraryName: 'maz-ui',
            styleLibraryName: 'css'
          }
        ]
      ]
    }
  },
  // build: {
  //   babel:{
  //     plugins: [
  //       ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
  //     ]
  //   }
  // },

  server: {
    port: process.env.PORT || 3000,
    // host: "0.0.0.0",
    timing: false
  },

  env: {
    BASE_URL_API: process.env.RUN_MODE || 'dev'
  }
}

// console.log('xxxxxxxxxxxx',process.env.RUN_MODE);
// console.log('Base url = ',process.env.BASE_URL_API);

