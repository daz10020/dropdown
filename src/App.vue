<template>
  <div id="app">
    <Page></Page>
  </div>
</template>

<script>
import Page from './page.vue'

export default {
  name: 'App',
  components: {
    Page
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
