const
	Playlist = require('../../../../database/models/playlist'),
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
.get('/v1/:user/playlists/:name', (req, res, next) => {
	try {
		Playlist.find({"creator": req.params.user, "name": req.params.name}, (err, list) => {
			if (err || !list) {
				return ({});
			} else {
				return (list);
			}
		})
	} catch (error) {
// err
	}
})
.post('/v1/users/playlists')
.delete('/v1/users/playlists/:id')

