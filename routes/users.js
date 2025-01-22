const express = require('express')
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const passport = require('passport')
const { saveRedirectUrl,validateUsername } = require('../middleware.js');
const {renderSignupForm, signup, renderSigninForm, signin, logout}  = require('../Controller/user.js')

router.route('/signup')
.get(renderSignupForm)
.post(validateUsername,wrapAsync(signup));

router.route('/login')
.get(renderSigninForm)
.post(saveRedirectUrl,passport.authenticate('local', {failureRedirect: '/login',failureFlash: true}),signin);

router.get('/logout',logout);

module.exports = router;