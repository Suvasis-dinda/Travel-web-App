const Listing = require('./models/listings');
const Review = require('./models/reviews.js');
const {listingSchema, reviewSchema} = require('./schema.js')
const ExpresssError = require('./utils/ExpressError.js')
const User = require('./models/user.js');
module.exports.isLoggedIn = (req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','please logged in')
        return res.redirect('/login')
    }
    next();
}


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash('error',"You don't have permission to Edit")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

// Validation Middleware
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    
    
    if(error){
        throw new ExpresssError(400, error)
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpresssError(400, error)
    } else {
        next();
    }
}


module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash('error',"You are not author of this Review")
        return res.redirect(`/listings/${id}`)
    }
    next();
}

// Username validation middleware
module.exports.validateUsername = async (req,res,next) => {
    // Define the criteria
    const minLength = 3;
    const maxLength = 20;
    const regex =/^[a-zA-Z][a-zA-Z0-9_]*$/;
  let {username} = req.body;
    // Check length
    if (username.length < minLength || username.length > maxLength) {
        req.flash('error','Username must be between 3 and 20 characters.');
        return res.redirect('/signup');
    }
  
    // Check format
    if (!regex.test(username)) {
      req.flash('error','Username must start with a letter and can only contain letters, numbers, and underscores.');
      return res.redirect('/signup');
    }
  
    // Check for uniqueness
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.flash('error','Username already taken.');
      return res.redirect('/signup');
    }
  
    next(); // No error
  };
  