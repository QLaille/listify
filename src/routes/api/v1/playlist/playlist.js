const
	Router = require('express').Router,
	PlaylistService = require('../../../../services/playlist'),
	HomeController = require('../../../../controllers/home')
;
const passport = require('passport');


module.exports = Router({mergeParams: true})

/*
** Create new playlist
*/
.post('/v1/playlist', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		HomeController.createNewPlaylist(req, res, next, user);
	})(req,res,next);
})

/*
** Delete one playlist
** This is a GET because forms dont handle DELETE requests
*/
.get('/v1/playlist/:id/delete', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}

		const id = req.params.id;
		await PlaylistService.removePlaylist(id);

		res.redirect('/home');
	})(req,res,next);
})
;
