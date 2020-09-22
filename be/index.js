const  GraphQLJSON = require( 'graphql-type-json')
const  shortid = require( 'shortid')

const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { ApolloServer,PubSub } = require("apollo-server-express");
const pubsub = new PubSub();
var resolvers = {
  JSON: GraphQLJSON,

  Counter: {
    countStr: counter => `Current count: ${counter.count}`,
  },


  Query: {
    hello: (root, { name }) => `Hello ${name || 'World'}!`,
    messages: (root, args, { db }) => db.get('messages').value(),
    uploads: (root, args, { db }) => db.get('uploads').value(),

  },

  Mutation: {
    myMutation: (root, args, context) => {
      const message = 'My mutation completed!'
      pubsub.publish('hey', { mySub: message })
      return message
    },
    addMessage: (root, { input }, {  db }) => {
      const message = {
        id: shortid.generate(),
        text: input.text,
      }

      // db
      //   .get('messages')
      //   .push(message)
      //   .last()
      //   .write()

      pubsub.publish('messages', { messageAdded: message })

      return message
    },

    singleUpload: (root, { file }, { processUpload }) => processUpload(file),
    multipleUpload: (root, { files }, { processUpload }) => Promise.all(files.map(processUpload)),

  },

  Subscription: {
    mySub: {
      subscribe: (parent, args, {  }) => pubsub.asyncIterator('hey'),
    },
    counter: {
      subscribe: (parent, args, {  }) => {
        const channel = Math.random().toString(36).substring(2, 15) // random channel name
        let count = 0
        setInterval(() => pubsub.publish(
          channel,
          {
            // eslint-disable-next-line no-plusplus
            counter: { count: count++ },
          }
        ), 2000)
        return pubsub.asyncIterator(channel)
      },
    },

    messageAdded: {
      subscribe: (parent, args, {  }) => pubsub.asyncIterator('messages'),
    },

  },
}

const server = new ApolloServer({
  typeDefs: require('./apollo-server/type-defs'),
  resolvers,
  // context: require('./apollo-server/context'),
});
server.applyMiddleware({ app});
const httpServer = http.createServer(app);var port = 4000;
httpServer.listen({ port }, () => {
  server.installSubscriptionHandlers(httpServer);
  console.log(`graphql ready at http://localhost:${port}/graphql`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`)
});
