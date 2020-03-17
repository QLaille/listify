const
	Router = require('express').Router
	playlist = require('../../../../services/playlist');
;

module.exports = Router({mergeParams: true})

// TODO add restriction to playlist name (US-ASCII)
// create new playlist
.post('/v1/playlist', async (req,res,next) => {
	try {
		const username = req.body.username;
		const playlistName = req.body.playlistName;
		let ret = await  playlist.createPlaylist(username, playlistName);

		if (ret === null)
			res.sendStatus(500);
		else if (ret === false)
			res.sendStatus(400);
		else
			res.status(200).send(ret);
	} catch {
// err
	}
})

// TODO consider search playlist by name
// get ONE(1) playlist with id or creator+name
.get('/v1/playlist', async (req,res,next) => { //TODO merge with the search route but add more params ?
	const creator = req.body.creator;
	const name = req.body.name;
	const id = req.body.id;

	let ret = await  playlist.playlistSearch(id, creator, name);

	if (ret === null) // Reverse order because it is a get
		res.send(500);
	else if (ret === false)
		res.send(400);
	else
		res.send(ret);
})

// delete one playlist
.delete('/v1/playlist', async (req,res,next) => { //TODO Add security to the delete
	try {
		const id = req.body.id;
		let ret = await playlist.removePlaylist(id);

		if (ret === true)
			res.sendStatus(200);
		else if (ret === null)
			res.sendStatus(400);
		else
			res.sendStatus(500);
	} catch {
// err
	}
})
;
