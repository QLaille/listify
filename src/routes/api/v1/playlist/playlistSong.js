const
	Router = require('express').Router,
	PlaylistService = require('../../../../services/playlist'),
	HomeController = require('../../../../controllers/home')
;
const passport = require('passport');


module.exports = Router({mergeParams: true})

/*
** Get songs from a playlist
*/
.get('/v1/playlist/song', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}
		const id = req.body.id;
		const ret = await PlaylistService.getSongsFromPlaylist(id);

		if (ret === null)
			res.sendStatus(500);
		else if (ret === false)
			res.sendStatus(400);
		else
			res.send(ret.songs);
	})(req,res,next);
})

/*
** Add song to a playlist
*/
.post('/v1/playlist/:id/song', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}
		HomeController.addSongToPlaylist(req,res,next);
	})(req,res,next);
})

/*
** Remove song from a playlist
** This is a GET because forms dont handle DELETE requests
*/
.get('/v1/playlist/:playlistId/:songId/delete' , async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}

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
	})(req,res,next);
})

/*
** Add one song to a playlist from the confirmation page
*/
.post('/v1/playlist/:playlistId/confirm/:songId', async (req,res,next) => {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}
		HomeController.addSongToPlaylist(req,res,next);
	})(req,res,next);
})