const
	Router = require('express').Router
	playlist = require('../../../../services/playlist');
;

module.exports = Router({mergeParams: true})
// get only songs from ONE(1) playlist, by id or creator + name ?
.get('/v1/playlist/song', async (req,res,next) => {
	const id = req.body.id;

	let ret = await playlist.getSongsFromPlaylist(id);

	if (ret === null) //Reverse order because it is a get
		res.sendStatus(500);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.send(ret.songs);
})

// add song to the playlist
.put('/v1/playlist/song', async (req,res,next) => { //TODO add multiple request types (one song, multiple songs)
	const id = req.body.id;
	const newSong = req.body.song;
	let ret = await playlist.addSongToPlaylist(id, newSong);

	if (ret === true)
		res.sendStatus(200);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.sendStatus(500);
})

// remove song from the playlist
.delete('/v1/playlist/song' , async (req,res,next) => { //TODO multiple request types: add more params, position of song, all song, etc.
	const id = req.body.id;
	const song = req.body.song;

	let ret = await playlist.removeSongFromPlaylist(id, song);

	if (ret === true)
		res.sendStatus(200);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.sendStatus(500);
})