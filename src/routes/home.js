const
	homeController = require('../controllers/home'),
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
.get('/home', homeController.index)
.get('/home/profile/:name', homeController.profile)
.get('/home/:user/playlist', homeController.showAllPlaylist)
.get('/home/:user/playlist/:name', homeController.showPlaylist)
.post('/home/new', homeController.newPlaylist)
.post('/home/:user/playlist/:name', homeController.addSongToPlaylist)
