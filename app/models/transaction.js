const commentSchema = require('./comment')

const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
	{
		symbol: {
			type: String,
			required: true,
		},
		buy: {
			type: Boolean,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		comments: [commentSchema],
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

module.exports = mongoose.model('Transaction', transactionSchema)
