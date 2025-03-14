import { iniTipc, type TipcExpose } from '@byc/tipc/renderer'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

iniTipc()
createApp(App).mount('#app')

const invoke = { } as TipcExpose

invoke.name('name')
