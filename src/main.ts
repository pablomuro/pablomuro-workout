import { createApp } from 'vue'
import App from './App.vue'

import './assets/style.scss'

// import { registerSW } from 'virtual:pwa-register'

// const updateSW = registerSW({
//   onNeedRefresh() {
//     // show a prompt to user
//   },
//   onOfflineReady() {
//     // show a ready to work offline to user
//     console.log('offline')
//   },
// })

createApp(App).mount('#app')
