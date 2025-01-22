const Listing = require('../models/listings');
const Review = require('../models/reviews')

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    
    req.flash('success','Review has Created')
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.distroyRoutes = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: { review:reviewId } } );
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Review has deleted')
    res.redirect(`/listings/${id}`)
}