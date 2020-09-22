const { createWriteStream } = require( 'fs')
const { resolve } = require( 'path')
const { sync } = require( 'mkdirp')
const { generate } = require( 'shortid')
const { db } = require( './db')

const uploadDir = resolve(__dirname, './uploads')

// Ensure upload directory exists
sync(uploadDir)

const storeUpload = async ({ stream, filename }) => {
  const id = generate()
  const file = `${id}-${filename}`
  const path = `${uploadDir}/${file}`
  const urlPath = `files/${file}`

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on('finish', () => resolve({ id, path: urlPath }))
      .on('error', reject),
  )
}

const recordFile = file =>
  db
    .get('uploads')
    .push(file)
    .last()
    .write()

async function processUpload (file) {
  const { stream, filename, mimetype, encoding } = await file
  const { id, path } = await storeUpload({ stream, filename })
  return recordFile({ id, filename, mimetype, encoding, path })
}

const http = require('http');
const express = require("express");
const app = express();
const { ApolloServer,PubSub } = require("apollo-server-express");
var resolvers = {
  Query: {
    uploads: (root, args, { db }) => db.get('uploads').value(),
  },

  Mutation: {
    singleUpload: (root, { file }, {  }) => processUpload(file),
    multipleUpload: (root, { files }, { }) => Promise.all(files.map(processUpload)),
  },
}
const server = new ApolloServer({
  typeDefs: `
  type File {
    id: ID!
    path: String!
    filename: String!
    mimetype: String!
    encoding: String!
  }
  type Query {
    uploads: [File]    
  }
  type Mutation {
    singleUpload (file: Upload!): File!
    multipleUpload (files: [Upload!]!): [File!]!
  }
  `,
  resolvers,  
});
server.applyMiddleware({ app});
const httpServer = http.createServer(app);var port = 4000;
httpServer.listen({ port }, () => {
  console.log(`graphql ready at http://localhost:${port}/graphql`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`)
});
