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

    <ApolloMutation
      :mutation="require('../graphql/AddMessage.gql')"
      :variables="{
        input: newMessage,
      }"
      class="form"
      @done="newMessage = ''"
    >
      <template slot-scope="{ mutate }">
        <form v-on:submit.prevent="formValid && mutate()">
          <label for="field-message">Message</label>
          <input
            id="field-message"
            v-model="newMessage"
            placeholder="Type a message"
            class="input"
          >
        </form>
      </template>
    </ApolloMutation>   
  </div>
</template>

<script>
import FILES from '../graphql/Files.gql'
import UPLOAD_FILE from '../graphql/UploadFile.gql'
// import gql from 'graphql-tag'
export default {
  data () {
    return {
      name: 'Anne',
      newMessage: '',
    }
  },

  apollo: {
   
  },

  computed: {
    formValid () {
      return this.newMessage
    },
  },

  methods: {
    onMessageAdded (previousResult, { subscriptionData }) {
      return {
        messages: [
          ...previousResult.messages,
          subscriptionData.data.messageAdded,
        ],
      }
    },

    async onUploadImage ({ target }) {
      if (!target.validity.valid) return
      await this.$apollo.mutate({
        mutation: UPLOAD_FILE,
        variables: {
          file: target.files[0],
        },
        update: (store, { data: { singleUpload } }) => {          
          const data = store.readQuery({ query: FILES })
          data.files.push(singleUpload)
          store.writeQuery({ query: FILES, data })
        },
      })
    }
  },
}
</script>

