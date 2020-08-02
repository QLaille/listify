const
	Router = require('express').Router,
	PlaylistService = require('../../../../services/playlist'),
	HomeController = require('../../../../controllers/home'),
;

const passport = require('passport');

module.exports = Router({mergeParams: true})

/*
** Get songs from a playlist
*/
.get('/v1/playlist/song', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), async (req,res,next) => {

	const id = req.body.id;
	const ret = await PlaylistService.getSongsFromPlaylist(id);

	if (ret === null)
		res.sendStatus(500);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.send(ret.songs);
})

/*
** Add song to a playlist
*/
.post('/v1/playlist/:id/song', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), async (req,res,next) => {
	HomeController.addSongToPlaylist(req,res,next);
})

/*
** Remove song from a playlist
** This is a GET because forms dont handle DELETE requests
*/
.get('/v1/playlist/:playlistId/:songId/delete', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), async (req,res,next) => {
	const id = req.params.playlistId;
	const song = req.params.songId;

	/* const ret =  */await PlaylistService.removeSongFromPlaylist(id, song);
	res.redirect(`/playlist/${id}`);
	// if (ret === true)
	// 	res.sendStatus(200);
	// else if (ret === false)
	// 	res.sendStatus(400);
	// else
	// 	res.sendStatus(500);


})

/*
** Add one song to a playlist from the confirmation page
*/
.post('/v1/playlist/:playlistId/confirm/:songId', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), async (req,res,next) => {
	HomeController.addSongToPlaylist(req,res,next);
})