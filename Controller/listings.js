require('dotenv').config()
const Listing = require('../models/listings.js')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken:process.env.MAPBOX_API_KEY});

module.exports.index = async (_,res)=>{
    const allData = await Listing.find({});
    res.render('listings/index.ejs',{allData});
    
}

module.exports.search = async(req,res)=>{
    const { query } = req.body;
    if (!query) {
      res.redirect('/listings')
    }
    // Construct the filter object
    let filter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };
    // // Perform the search in MongoDB
    const allData = await Listing.find(filter);

    res.render("listings/index.ejs",{allData})
  
}

module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new.ejs')
}

module.exports.showListings = async(req,res)=>{
    let{id} =req.params;
    const data = await Listing.findById(id)
    .populate({
        path:"review",
        populate:{
        path:'author'
        }
    })
    .populate('owner'); 
    
    if(!data){
        req.flash('error','Listing you requested for does not exixt!')
        res.redirect('/listings')
    }
    res.render('listings/show.ejs',{data});
}

module.exports.addnewListings = async (req,res)=>{
    let response = await geocodingClient.forwardGeocode({
                    query: req.body.listing.location,
                    limit: 2
                })
                .send();

    let newListing = new Listing(req.body.listing);
    newListing.geometry = response.body.features[0].geometry
    
    let {path, filename} = req.file
    newListing.owner = req.user._id;
    newListing.image = {url:path, filename}
    await newListing.save();
    
    req.flash('success','New listing created')
    res.redirect('/listings')
}

module.exports.distroyRoutes = async(req,res)=>{
    let{id}=req.params;
    await Listing.findByIdAndDelete(id);
    
    req.flash('success','Listing has deleted')
    res.redirect('/listings')
}

module.exports.renderEditForm = async(req,res)=>{
    let{id}=req.params;
    let data = await Listing.findById(id);
    if(!data){
        req.flash('error','Listing you requested for does not exixt!')
        res.redirect('/listings')
    }
    let originalUrl = data.image.url;
     originalUrl = originalUrl.replace('/upload','/upload/w_250')
    
    
    req.flash('success','Listing has Edited')
    res.render('listings/Edit.ejs',{data, originalUrl});
}

module.exports.updateListings = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,req.body.listing)

    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename}
        await listing.save();
    }

    req.flash('success','listing has Updeted')
    res.redirect(`/listings/${id}`)
}