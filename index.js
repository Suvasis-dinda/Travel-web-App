const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ExpresssError = require('./utils/ExpressError.js')
const engine = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const listingsRoutes = require('./routes/listings.js')
const reviewsRoutes = require('./routes/reviews.js')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const userRoutes = require('./routes/users.js')
const Listing = require('./models/listings.js')

require('dotenv').config()

 // Database Connection
 async function main(){
    await mongoose.connect(`${process.env.DB_URL}/wanderLast`);
}
main().then(()=>{console.log('connection successfully')})



// Middleware Setup
app.set('view engine','ejs')
app.engine('ejs', engine);
app.set('views',path.join(__dirname,'/views'))
app.use(express.static(path.join(__dirname,'/public')))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

//create session
const sessionInfo = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:  7 * 24 * 60 * 60 *1000,
        httpOnly:true
    }
}
app.use(session(sessionInfo))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
})

app.get("/",async(req,res)=>{
    const allData = await Listing.find({});
    res.render('listings/index.ejs',{allData});
})

app.use('/listings', listingsRoutes )
app.use('/listings/:id/reviews', reviewsRoutes);
app.use('/', userRoutes)


// 404 Not Found
app.all('*',(req,res,next)=>{
    next(new ExpresssError(404, "page not found"))
})

// Error Handling Middleware
app.use((err,req,res,next)=>{
    let {status = 500, message = 'something went wrong'} = err;
    console.log(err);
    
    res.status(status).render("listings/Error.ejs", {message})
})


// Server Listening
app.listen(4000,()=>{
    console.log(`app is listioning on http://localhost:4000/listings`)
})


// const express = require('express');
// const app = express();
// const path = require('path');
// const mongoose = require('mongoose');
// const methodOverride = require('method-override');
// const wrapAsync = require('./utils/wrapAsync.js');
// const ExpressError = require('./utils/ExpressError.js');
// const { listingSchema } = require('./schema.js');
// const Listing = require('./models/data');
// const engine = require('ejs-mate');

// 
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '/views'));
// app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
// app.engine('ejs', engine);

// // Database Connection
// async function main(){
//         await mongoose.connect('mongodb://127.0.0.1:27017/wanderLast');
// }
    
// main().then(()=>{console.log('connection successfully')})

// 
// const validateListing = (req, res, next) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//         return next(new ExpressError(400, error.details.map(detail => detail.message).join(', ')));
//     }
//     next();
// };


// // Routes
// app.get('/listings', wrapAsync(async (req, res) => {
  
//     res.render('listings/index.ejs');
    
// }));

// app.get('/listings/new', (req, res) => {
//     res.render('listings/new.ejs');
// });

// app.get('/listings/:id', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const data = await Listing.findById(id);
//     res.render('listings/show.ejs', { data });
// }));

// app.post('/listings/add', validateListing, wrapAsync(async (req, res) => {
//     const user = new Listing(req.body);
//     await user.save();
//     res.redirect('/listings');
// }));

// app.delete('/listings/delete/:id', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect('/listings');
// }));

// app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     const data = await Listing.findById(id);
//     res.render('listings/Edit.ejs', { data });
// }));

// app.put('/listings/:id/edits', validateListing, wrapAsync(async (req, res) => {
//     const { id } = req.params;
//     await Listing.findByIdAndUpdate(id, req.body);
//     res.redirect('/listings');
// }));

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//     const { status = 500, message = 'Something went wrong' } = err;
//     res.status(status).render('Error.ejs', { message });
// });

// // 404 Not Found
// app.all('*', (req, res, next) => {
//     next(new ExpressError(404, 'Page not found'));
// });

// // Server Listening
// app.listen(4000, () => {
//     console.log('App is listening on http://localhost:4000/listings');
// });
