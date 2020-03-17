const
	Router = require('express').Router
	playlist = require('../../../../services/playlist');
;

module.exports = Router({mergeParams: true})
//change playlist name, provide ID //TODO check if it is the creator which wants to update the name
.put('/v1/playlist/name', async (req,res,next) => {
	const id = req.body.id;
	const newName = req.body.new;
	let ret = await playlist.updatePlaylistName(id, newName);

	if (ret === true)
		res.sendStatus(200);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.sendStatus(500);
})
