// import dependencies
const express = require('express')
const passport = require('passport')

// pull in Mongoose model for transactions
const Transaction = require('../models/transaction')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

//////////////////////////////////////////////////
// routes go here

// Create a comment
// POST -> Create a comment and give that comment to a transaction
// POST /comments/:transactionId
// we'll make it so that ANYBODY can give a transaction a comment
// which means we wont requireToken
// our commentSchema has some non-required fields
// so we'll use removeBlanks ????????????????????
router.post('/comments/:transactionId', removeBlanks, (req, res, next) => {
    // save the comment from req.body to a variable
    const comment = req.body.comment
    // isolate the transaction id for ease of use
    const transactionId = req.params.transactionId
    // find the transaction
    Transaction.findById(transactionId)
        // make sure we have a transaction
        .then(handle404)
        // push the new comment into the transaction's array
        // save the transaction
        .then(transaction => {
            transaction.comments.push(comment)
            
            return transaction.save()
        })
        // send our info after the transaction has been updated
        // .json({ nameOfObject: value })
        .then(transaction => res.status(201).json({ transaction: transaction }))
        // handle any errors
        .catch(next)
})

// ONLY the owner of a transaction can update or delete a transaction comment
// PATCH -> Update a comment
// PATCH /comments/:transactionId/:commentId
router.patch('/comments/:transactionId/:commentId', requireToken, removeBlanks, (req, res, next) => {
    // save both ids to variable to easily use later
    const transactionId = req.params.transactionId
    const commentId = req.params.commentId

    // find our transaction
    Transaction.findById(transactionId)
        .then(handle404)
        .then(transaction => {
            // single out the comment
            const theComment = transaction.comments.id(commentId)
            // make sure the user is the transaction's owner
            requireOwnership(req, transaction)
            // update the comment with req.body.comment
            theComment.set(req.body.comment)

            // return the saved transaction
            return transaction.save()
        })
        // send a status
        .then(() => res.sendStatus(204))
        .catch(next)
})

// Delete a comment

// ONLY the owner of a transaction can update or delete a transaction comment
// DELETE -> delete a comment
// DELETE /comments/:transactionId/:commentId
router.delete('/comments/:transactionId/:commentId', requireToken, removeBlanks, (req, res, next) => {
    // save both ids to variable to easily use later
    const transactionId = req.params.transactionId
    const commentId = req.params.commentId

    // find our transaction
    Transaction.findById(transactionId)
        .then(handle404)
        .then(transaction => {
            // single out the comment
            const theComment = transaction.comments.id(commentId)
            // make sure the user is the transaction's owner
            requireOwnership(req, transaction)
            // delete the comment from the transaction
            theComment.deleteOne()

            // return the saved transaction
            return transaction.save()
        })
        // send a status
        .then(() => res.sendStatus(204))
        .catch(next)
})


// End of routes
//////////////////////////////////////////////////

// export router
module.exports = router