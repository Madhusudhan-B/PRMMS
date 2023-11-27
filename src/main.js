/* eslint-disable import/order */
import '@/@fake-db/db'
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import ability from '@/plugins/casl/ability'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import { abilitiesPlugin } from '@casl/vue'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import panZoom from 'vue-panzoom'
import cors from 'cors'


(async () => {
  const sourceMapSupport = await import('source-map-support');
  sourceMapSupport.default.install();
})();

//import * as Vue from 'vue'
loadFonts()

//Vue.prototype.$AuthService = new AuthService()
// Create vue app
const app = createApp(App)

// Use plugins

app.use(vuetify)
app.use(createPinia())
app.use(panZoom)
app.use(router)
app.use(layoutsPlugin)
app.use(i18n)
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
})

app.use('/dashboards-azure', cors());

// Mount vue app
app.mount('#app')
