const
	rootController = require('../controllers/root'),
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
.get('/', rootController.index)
.get('/about', rootController.about)
.get('/contact', rootController.contact)
.get('/login', rootController.login)