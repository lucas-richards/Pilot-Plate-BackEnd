const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema(
	{
		symbol: {
			type: String,
			required: true,
		},
		logo:String,
		name:String,
		price: {
			type: Number,
			required: true,
		},
		prev_price:Number,
		open:Number,
		high:Number,
		low:Number,
		close:Number,
		volume:Number,
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Stock', stockSchema)
