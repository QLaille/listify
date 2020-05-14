const
	homeController = require('../controllers/home'),
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
.get('/home', homeController.index)
.get('/@/:name', homeController.profile)
.get('/playlist/:id', homeController.showPlaylist)
.get('/search', homeController.search)
.post('/playlist/new', homeController.postNewPlaylist)
.post('/playlist/:id', homeController.addSongToPlaylist)
.get('/song/:id', homeController.songPage)
.get('/confirm', homeController.confirmPage)
.post('/confirm/:playlistId/:songId', homeController.addSongToPlaylist)
;