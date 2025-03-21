/* eslint-disable no-console */
import { invoke, listener } from '@byc/tipc'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

createApp(App).mount('#app')
invoke.common.hello('hello').then(console.log)
const off = listener.common.hello(msg => console.log(msg))

setTimeout(() => {
  off()
}, 10000)
