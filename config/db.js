'use strict'
require('dotenv').config()

// creating a base name for the mongodb
// REPLACE THE STRING WITH YOUR OWN DATABASE NAME
const mongooseBaseName = 'tradingPlaygroundAPIDB'

// create the mongodb uri for development and test
const database = {
	development: process.env.DATABASE_URL,
	test: process.env.DATABASE_URL,
}

// Identify if development environment is test or development
// select DB based on whether a test file was executed before `server.js`
const localDb = process.env.TESTENV ? database.test : database.development

// Environment variable DATABASE_URL will be available in
// heroku production evironment otherwise use test or development db
const currentDb = process.env.DATABASE_URL || localDb


module.exports = currentDb
