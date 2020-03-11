const
	Router = require('express').Router
;

module.exports = Router({mergeParams: true}) // TODO the api route for playlist is dubious, perhaps make "users" first in the route ?
.get('/v1/playlist/:id', async (req,res,next) => { // get playlists by name
	try {
		const playlist = await req.db.Playlist.findById(req.params.id);
		// return playlist if found
	} catch (error) {
		next (error)
	}
})
.get('/v1/playlist/user/:name', async (req,res,next) => { // get user's playlists

})
.post('/v1/playlist/user/:name', async (req,res,next) => { // create playlist for user
	try {

	} catch (error) {}
})
.put('/v1/playlist/:id', async (req,res,next) => { // edit playlist name
	try {
		const playlist = await req.db.Playlist.findById(req.params.id);
		playlist.name = req.body.name;
		await playlist.save();
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
})
.delete('/v1/playlist/:id', async (req,res,next) => {  // delete playlist by name
	try {
		// const playlist = await req.db.Playlist.deleteById(req.params.id);

	} catch (error) {}
})