const
	Router = require('express').Router,
	PlaylistService = require('../../../../services/playlist'),
	HomeController = require('../../../../controllers/home'),
;
const passport = require('passport');


module.exports = Router({mergeParams: true})

/*
** Create new playlist
*/
.post('/v1/playlist', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), async (req,res,next) => {
		HomeController.createNewPlaylist(req, res, next, req.user);
})

/*
** Delete one playlist
** This is a GET because forms dont handle DELETE requests
*/
.get('/v1/playlist/:id/delete', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), async (req,res,next) => {
	await PlaylistService.removePlaylist(req.params.id);

	res.redirect('/home');
})
;
