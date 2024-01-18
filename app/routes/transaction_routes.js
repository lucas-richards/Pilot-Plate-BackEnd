// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Transaction = require('../models/transaction')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
const PAGE_SIZE = 6; // Set your desired page size
// GET /transactions
router.get('/transactions', (req, res, next) => {
	const { page } = req.query
	const limit = parseInt(PAGE_SIZE) + parseInt(page)
	console.log(limit)

	Transaction.find().populate('owner').sort({ createdAt: -1 }).limit(limit)
		.then((transactions) => {
			
			return transactions.map((transaction) => transaction.toObject())
		})
		// respond with status 200 and JSON of the transactions
		.then((transactions) => res.status(200).json({ transactions: transactions }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// // GET /transactions/5a7db6c74d55bc51bdf39793
// router.get('/transactions/:id', (req, res, next) => {
// 	// req.params.id will be set based on the `:id` in the route
// 	Transaction.findById(req.params.id)
// 		.then(handle404)
// 		// if `findById` is succesful, respond with 200 and "transaction" JSON
// 		.then((transaction) => res.status(200).json({ transaction: transaction.toObject() }))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })

// CREATE
// POST /transactions
router.post('/transactions', (req, res, next) => {
	// set owner of new transaction to be current user
	console.log('req.user',req.body.user)
	console.log(req.body)
	req.body.transaction.owner = req.body.user._id

	Transaction.create(req.body.transaction)
		// respond to succesful `create` with status 201 and JSON of new "transaction"
		.then((transaction) => {
			res.status(201).json({ transaction: transaction.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})


module.exports = router
