const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema(
	{
		symbol: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
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
