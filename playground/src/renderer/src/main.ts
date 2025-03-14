import { invoke } from '@byc/tipc'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

createApp(App).mount('#app')
invoke.common.hello('name')
