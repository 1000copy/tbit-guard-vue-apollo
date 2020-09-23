<template>
  <div class="apollo-example">
    <div v-for="message of messages" :key="message">
            {{ message }}
    </div>
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
    messages: {
      query: gql`query messages {messages}`,
      subscribeToMore: {
        document: gql`subscription messageAdded {
            messageAdded 
        }`,
        variables () {
          return {}
        },
        // 变更之前的结果
        updateQuery: (previousResult, { subscriptionData }) => {
          // 在这里用之前的结果和新数据组合成新的结果
          console.log(previousResult.messages, subscriptionData )
          var r = [
            ...previousResult.messages,
            subscriptionData.data.messageAdded
            ] 
          
          return  {messages:r}
        },
      }
    }
  },
  computed: {
    formValid () {
      return this.newMessage
    },
  },

  methods: {
     async newMessage1() {
      // const result = 
      await this.$apollo.mutate({
        mutation: gql`mutation addMessage ($input: String!) {
            addMessage (input: $input) 
          }
        `,        
        variables: {
          input: this.newMessage,
        },
      })      
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

