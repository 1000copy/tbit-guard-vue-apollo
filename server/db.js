const Lowdb = require( 'lowdb')
const FileSync = require( 'lowdb/adapters/FileSync')

const { resolve } = require( 'path')

// mkdirp(resolve(__dirname, './live'))

exports.db = new Lowdb(new FileSync(resolve(__dirname, './db.json')))

// Seed an empty DB
exports.db.defaults({
  messages: [],
  uploads: [],
}).write()
