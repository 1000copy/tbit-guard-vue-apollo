const Lowdb = require( 'lowdb')
const FileSync = require( 'lowdb/adapters/FileSync')
const mkdirp = require( 'mkdirp')
const { resolve } = require( 'path')

mkdirp(resolve(__dirname, '../../live'))

exports.db = new Lowdb(new FileSync(resolve(__dirname, '../../live/db.json')))

// Seed an empty DB
exports.db.defaults({
  messages: [],
  uploads: [],
}).write()
