import Vue from 'vue'
import App from './App.vue'
// import { createProvider } from './vue-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
// 新的引入文件
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import VueApollo from 'vue-apollo'

const httpLink = new HttpLink({
  // 你需要在这里使用绝对路径
  uri: 'http://localhost:4000/graphql',
})

// 创建订阅的 websocket 连接
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/subscriptions',
  // uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
  },
})

// 使用分割连接的功能
// 你可以根据发送的操作类型将数据发送到不同的连接
const link = split(
  // 根据操作类型分割
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
  },
  wsLink,
  httpLink
)

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

// 像之前一样安装 vue 插件
Vue.use(VueApollo)
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
Vue.config.productionTip = false

new Vue({
  // apolloProvider: createProvider(),
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
