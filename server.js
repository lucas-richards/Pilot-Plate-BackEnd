// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const fetch = require('node-fetch')

// require route files
const transactionRoutes = require('./app/routes/transaction_routes')
const businessRoutes = require('./app/routes/business_routes')
const userRoutes = require('./app/routes/user_routes')

// require middleware
const errorHandler = require('./lib/error_handler')
const replaceToken = require('./lib/replace_token')
const requestLogger = require('./lib/request_logger')

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require('./config/db')

// require configured passport authentication middleware
const auth = require('./lib/auth')

// define server and client ports
// used for cors and local port declaration
const serverDevPort = 8000
const clientDevPort = 3000

// establish database connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
mongoose.connect(db, {
	useNewUrlParser: true,
})




// instantiate express application object
const app = express()

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(
	cors({
		origin: process.env.CLIENT_ORIGIN || `http://localhost:${clientDevPort}`
	})
)

// Yelp API
  
app.get('/yelp-data/:loc', async (req, res) => {

try {
	console.log('API_KEY=',process.env.API_KEY)
	const response = await fetch(
		req.query.location?
		`https://api.yelp.com/v3/businesses/search?location=${req.query.location}&price=${req.query.price}&term=${req.query.term}&radius=${req.query.radius}&sort_by=best_match&limit=50`
	:
		`https://api.yelp.com/v3/businesses/search?latitude=${req.query.latitude}&longitude=${req.query.longitude}&price=${req.query.price}&term=${req.query.term}&radius=${req.query.radius}&sort_by=best_match&limit=50`
	, {
		method: 'GET',
		headers: {
		'Authorization': process.env.API_KEY,
		
	},
	
	
});
	console.log('#############req.query',req.query)
	console.log(`https://api.yelp.com/v3/businesses/search?location=${req.query.location}&price=${req.query.price}&longitude=${req.query.longitude}&latitude=${req.query.latitude}&term=${req.query.term}&radius=${req.query.radius}&sort_by=best_match&limit=50`)
	
	
	const data = await response.json();
	res.json(data);
} catch (error) {
	console.log('this is the yelp api erro',error)
}
});

// https://api.yelp.com/v3/businesses/search?location=LA&latitude=34.052235&longitude=-118.243683&sort_by=best_match&limit=20"
// https://api.yelp.com/v3/businesses/search?location=LA&longitude=34.052235&latitude=-118.243683&sort_by=best_match&limit=50"
  

// define port for API to run on
// adding PORT= to your env file will be necessary for deployment
const port = process.env.PORT || serverDevPort

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use(replaceToken)

// register passport authentication middleware
app.use(auth)

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(express.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

// log each request as it comes in for debugging
app.use(requestLogger)

// register route files
app.use(transactionRoutes)
app.use(businessRoutes)
app.use(userRoutes)

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

// run API on designated port (4741 in this case)
app.listen(port, () => {
	console.log('listening on port ' + port )
})

// needed for testing
module.exports = app
