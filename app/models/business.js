const mongoose = require('mongoose')

const businessSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		yelp_id: {
			type:String,
		},
		image_url: {
			type: String,
		},
		price: {
			type: Number
		},
		rating: {
			type: Number,
			required: false,
		},
		categories: {
			type:Array,
			default:[]
		},
		favorite: {
			type:Boolean
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		distance:{
			type:Number
		},
		url: {
			type: String
		},
		display_address:{
			type:Array,
			default:[]
		},
		transactions:{
			type:Array,
			default:[]
		},
		display_phone:{
			type:String
		}
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Business', businessSchema)
