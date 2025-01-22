const express = require('express')
const router = express.Router({mergeParams:true})
const wrapAsync = require('../utils/wrapAsync.js')
const Listing = require('../models/listings.js')
const Review = require('../models/reviews.js')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware.js')
const {createReview, distroyRoutes} = require('../Controller/review.js')

 // review
// create review
router.post('/',isLoggedIn,validateReview,wrapAsync(createReview))

// delete review
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(distroyRoutes))


module.exports = router