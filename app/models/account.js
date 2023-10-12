const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema(
	{
		savings: {
			type: Number,
            default:1000,
			required: true,
		},
		investments: {
			type: Number,
            default:0,
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

module.exports = mongoose.model('Account', accountSchema)
