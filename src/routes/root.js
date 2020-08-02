const
	Router = require('express').Router,
	RootController = require('../controllers/root'),
	HomeController = require('../controllers/home'),
;
const passport = require('passport');

module.exports = Router({mergeParams: true})

.get('/', RootController.indexPage)

.get('/login', RootController.loginPage)

.get('/home', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), (req,res,next) => {
	HomeController.index(req,res,next, req.user);
})

.get('/search', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), (req,res,next) => {
	HomeController.searchPage(req,res,next);
})
.get('/confirm', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), (req,res,next) => {
	HomeController.confirmPage(req,res,next);
})

.get('/playlist/:id', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), (req,res,next) => {
	HomeController.showPlaylistPage(req,res,next,req.user);
})

.get('/@/:name', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), (req,res,next) => {
	HomeController.profilePage(req,res,next,req.user);
})

.get('/song/:id', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), (req,res,next) => {
	HomeController.requestSongPage(req,res,next);
})

;