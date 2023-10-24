// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Business = require('../models/business')

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
// GET /businesses
router.get('/businesses', (req, res, next) => {
	const ownerIdToFind = req.query.ownerIdToFind;
	// Define the query object based on whether ownerIdToFind is provided
	const query = ownerIdToFind ? { owner: ownerIdToFind } : {};
	Business.find(query).populate('owner')
		.then((businesses) => {
			return businesses.map((business) => business.toObject())
		})
		// respond with status 200 and JSON of the businesss
		.then((businesses) => res.status(200).json({ businesses: businesses }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /businesses/5a7db6c74d55bc51bdf39793
router.get('/businesses/:id', (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Business.findById(req.params.id).populate('owner')
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "business" JSON
		.then((business) => res.status(200).json({ business: business.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /businesses
router.post('/businesses', requireToken, (req, res, next) => {
	// set owner of new business to be current user
	req.body.owner = req.user.id
	console.log(req.body)

	Business.create(req.body)
		// respond to succesful `create` with status 201 and JSON of new "business"
		.then((business) => {
			res.status(201).json({ business: business.toObject() })
		})
		// if an error occurs, pass it off to our error handler
		// the error handler needs the error message and the `res` object so that it
		// can send an error message back to the client
		.catch(next)
})

// UPDATE
// PATCH /businesses/5a7db6c74d55bc51bdf39793
router.patch('/businesses/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.business.owner

	Business.findById(req.params.id)
		.then(handle404)
		.then((business) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, business)

			// pass the result of Mongoose's `.update` to the next `.then`
			return business.updateOne(req.body.business)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})


module.exports = router
