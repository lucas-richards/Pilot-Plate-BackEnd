const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema(
	{
		title: {
			type: Number,
			required: true,
		},
		desc: {
			type: String,
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

module.exports = mongoose.model('Place', placeSchema)
