<template>
  <div class="apollo-example">
    <!-- Tchat example -->
    <ApolloQuery
      :query="require('../graphql/Messages.gql')"
    >
      <ApolloSubscribeToMore
        :document="require('../graphql/MessageAdded.gql')"
        :update-query="onMessageAdded"
      />
      <div slot-scope="{ result: { data } }">
        <template v-if="data">
          <div
            v-for="message of data.messages"
            :key="message"
            class="message"
          >
            {{ message }}
          </div>
        </template>
      </div>
    </ApolloQuery>
   
    <form v-on:submit.prevent>
          <label for="field-message">Message</label>
          <input
            id="field-message"
            v-model="newMessage"
            placeholder="Type a message"
            class="input"
          >
          <button @click="newMessage1">new message</button>
        </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  data () {
    return {
      newMessage: '',
    }
  },
  apollo: {
    hello: gql`query {
      hello
    }`,
  },

  computed: {
    formValid () {
      return this.newMessage
    },
  },

  methods: {
     async newMessage1() {
      const result = await this.$apollo.mutate({
        // 查询语句
        mutation: gql`mutation addMessage ($input: String!) {
            addMessage (input: $input) 
          }
        `,
        // 参数
        variables: {
          input: this.newMessage,
        },
      })
      console.log('result:',result)
    },
    onMessageAdded (previousResult, { subscriptionData }) {
      return {
        messages: [
          ...previousResult.messages,
          subscriptionData.data.messageAdded,
        ],
      }
    },  
  },
}
</script>

