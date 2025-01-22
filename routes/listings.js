const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js')

const { isLoggedIn, isOwner,validateListing } = require('../middleware.js');
const {index, search, renderNewForm, showListings, addnewListings, distroyRoutes, renderEditForm, updateListings} = require('../Controller/listings.js')
const multer = require('multer');
const {storage} = require('../cloudinary.js')
const upload = multer({storage})
// index route
router.route("/")
.get(wrapAsync(index))
.post(isLoggedIn,
    upload.single('listing[url]'),
    validateListing,
    wrapAsync(addnewListings)
    );


//search data
router.post('/search',search);

// new Routes
router.get('/new',isLoggedIn,renderNewForm);

router.get('/:id',wrapAsync(showListings));

router.delete('/delete/:id',isLoggedIn,isOwner,wrapAsync(distroyRoutes));

router.route('/:id/edit')
.get(isLoggedIn,isOwner,wrapAsync(renderEditForm))
.put(isLoggedIn,isOwner,upload.single('listing[url]'),validateListing,wrapAsync(updateListings));


module.exports = router;