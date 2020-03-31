const
	rootController = require('../controllers/root'),
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
.get('/', rootController.index)
.get('/login', rootController.login)