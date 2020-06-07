const
	Router = require('express').Router,
	RootController = require('../controllers/root'),
	HomeController = require('../controllers/home')
;
const passport = require('passport');


module.exports = Router({mergeParams: true})
.get('/', RootController.indexPage)
.get('/login', RootController.loginPage)

.get('/home', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		HomeController.index(req,res,next, user);
	})(req,res,next);
})
.get('/search', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		HomeController.searchPage(req,res,next);
	})(req,res,next);
})
.get('/confirm', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		HomeController.confirmPage(req,res,next);
	})(req,res,next);
})

.get('/playlist/:id', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		HomeController.showPlaylistPage(req,res,next,user);
	})(req,res,next);
})

.get('/@/:name', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		HomeController.profilePage(req,res,next,user);
	})(req,res,next);
})

.get('/song/:id', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		HomeController.requestSongPage(req,res,next);
	})(req,res,next)
});
