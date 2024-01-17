const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
	{
		business_name: {
			type: String,
			required: true,
		},
		yelp_id: {
			type:String,
		},
		image_url: {
			type: String,
		},
		favorite: {
			type:Boolean
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		display_address:{
			type:Array,
			default:[]
		},
		comment:{
			type:String
		},
		
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Transaction', transactionSchema)
