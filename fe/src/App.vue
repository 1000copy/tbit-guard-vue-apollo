<template>
  <div id="app">    
    <h1>Welcome to your vue apollo Subscription App</h1>
    <ApolloPure/>
  </div>
</template>

<script>
// import ApolloExample from './components/ApolloExample.vue'
import ApolloPure from './components/apolloPure.vue'

export default {
  name: 'App',
  components: {
    // ApolloExample,
    ApolloPure
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
