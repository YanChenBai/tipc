<script setup lang="ts">
import type { MainSender } from 'src/commons/main'

function send() {
  window.api.main.getName()
    .then((data) => {
    // eslint-disable-next-line no-console
      console.log(data)
    })
}

const mainListener = window.createListener<MainSender>()

mainListener('sum', (a, b) => {
  // eslint-disable-next-line no-console
  console.log(a + b)
})
</script>

<template>
  <img alt="logo" class="logo" src="./assets/electron.svg">
  <div class="creator">
    Powered by electron-vite
  </div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">
    Please try pressing <code>F12</code> to open the devTool
  </p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="send">Send IPC</a>
    </div>
  </div>
</template>
