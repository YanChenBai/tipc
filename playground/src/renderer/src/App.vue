<script setup lang="ts">
const remove = window.listener.tell((e) => {
  // eslint-disable-next-line no-console
  console.log(e)
})

// eslint-disable-next-line no-console
window.invoke2.getWinId().then(console.log)
function send() {
  window.invoke.minimize()
  remove()
}
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
