

const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		}
	},
	{
		timestamps: true,
	}
)

module.exports = commentSchema
