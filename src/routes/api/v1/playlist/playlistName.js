const
	Router = require('express').Router
	playlist = require('../../../../services/playlist');
;

const passport = require('passport');

module.exports = Router({mergeParams: true})
//change playlist name, provide ID
.put('/v1/playlist/name', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), async (req,res,next) => {
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
