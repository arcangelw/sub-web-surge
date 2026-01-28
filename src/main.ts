import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import installElementPlus from '@/plugins/element-ui'
import installClipboard from '@/plugins/clipboard'
import installAxios from '@/plugins/axios'
import installDevice from '@/plugins/device'
import installIcons from '@/icons'

const app = createApp(App)

installElementPlus(app)
installClipboard(app)
installAxios(app)
installDevice(app)
installIcons(app)

app.use(router)
app.mount('#app')
