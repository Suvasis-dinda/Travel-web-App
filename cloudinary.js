// // cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config()
// Configure Cloudinary with your credentials
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a Cloudinary storage instance
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'WanderLast_DEV',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

// Create a Multer instance with the Cloudinary storage
// const upload = multer({ storage });

module.exports = { cloudinary, storage  };


