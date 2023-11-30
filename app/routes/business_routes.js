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
router.get('/businesses/:dataId', (req, res, next) => {
	console.log('this is req.query,dataId =',req.query.dataId)
	const yelpIdToFind = req.query.dataId;
	// Define the query object based on whether ownerIdToFind is provided
	let query = yelpIdToFind ? { yelp_id: yelpIdToFind } : {};
	if (req.query.dataId === 'undefined') query={}
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
// // GET /businesses/5a7db6c74d55bc51bdf39793
// router.get('/businesses/:id', (req, res, next) => {
// 	// req.params.id will be set based on the `:id` in the route
// 	Business.findById(req.params.id)
// 		.then(handle404)
// 		// if `findById` is succesful, respond with 200 and "business" JSON
// 		.then((business) => res.status(200).json({ business: business.toObject() }))
// 		// if an error occurs, pass it to the handler
// 		.catch(next)
// })

// CREATE
// POST /businesses
router.post('/businesses', (req, res, next) => {
	// set owner of new business to be current user
	console.log('req.user',req.body.user)
	console.log(req.body)
	req.body.business.owner = req.body.user._id

	Business.create(req.body.business)
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
router.delete('/businesses/:id', (req, res, next) => {
	console.log(req.params.id)
	Business.find({ _id: req.params.id })
			.then((business) => {
				console.log('business',business)
				// delete the comment from the transaction
				business.deleteOne()

				// return the saved transaction
				return business.save()
			})
			// if that succeeded, return 204 and no JSON
			.then(() => res.sendStatus(204))
			// if an error occurs, pass it to the handler
			.catch(next)
            
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})


module.exports = router
