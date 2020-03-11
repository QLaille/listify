const
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
.get('/v1/playlist/:id') // get playlist songs
.post('/v1/playlist/:id', ) // add song to playlist
.put('/v1/playlist/:id', async (req,res,next) => { // edit playlist's song (position in the list)
	try {
	} catch (error) {
		next(error);
	}
})
.delete('/v1/playlist/:id', ) // remove playlist's song