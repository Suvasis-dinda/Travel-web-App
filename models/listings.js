
const mongoose = require('mongoose');
const Review =require('./reviews')
const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set:(v)=>v===""?"https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
        },
        filename:{
            type:String,
        }
    },
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    geometry:{
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
})

listingSchema.post('findOneAndDelete',async(listings)=>{
    if(listings.review.length){
        await Review.deleteMany({_id: {$in:listings.review}});
    }
});


const Listing =mongoose.model('Listing',listingSchema)
module.exports = Listing;