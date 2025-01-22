const User = require('../models/user.js');

module.exports.renderSignupForm = (req,res)=>{
            res.render('users/regiter')
}

module.exports.signup = async(req,res,next)=>{
    try{
            const {email,username,password} = req.body;
            const newUser = new User({
                email,
                username
            })
            let registerUser = await User.register(newUser,password);

            req.login(registerUser,(err)=>{
                if(err){
                    return next(err)
                }
                req.flash('success','welcome to wanderLast')
                res.redirect('/listings')
            });     
            
    } catch(e){
        req.flash('error',`${e.message}`);
        res.redirect('/')
    }
}

module.exports.renderSigninForm = (req,res)=>{
    res.render('users/login');
}

module.exports.signin = async (req, res) => {
    req.flash('success', 'Welcome back to WanderLast!');
    let redirectUrl = res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl); // Redirecting to another route
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
   
        req.flash('success','you are log out');
        res.redirect('/listings')
    })
}