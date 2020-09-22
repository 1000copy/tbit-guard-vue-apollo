const http = require('http');
const express = require("express");
const app = express();
const { ApolloServer,PubSub } = require("apollo-server-express");
const pubsub = new PubSub();
const channelName = 'message'
var resolvers = {
  Query:{
    messages: (root, { input }) => {
      return ['1','2']
    },
  },
  Mutation: {
    addMessage: (root, { input }) => {
      pubsub.publish(channelName, { messageAdded: input })
      return input
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: (parent, args, {  }) => pubsub.asyncIterator(channelName),
    },
  },
}
const server = new ApolloServer({
  typeDefs: `
    type Query{
      messages:[String] 
    }
    type Mutation {
      addMessage (input: String!): String!  
    }
    type Subscription {
      messageAdded: String!
    }
  `,
  resolvers,  
});
server.applyMiddleware({ app});
const httpServer = http.createServer(app);var port = 4000;
httpServer.listen({ port }, () => {
  server.installSubscriptionHandlers(httpServer);
  console.log(`graphql ready at http://localhost:${port}/graphql`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`)
});
