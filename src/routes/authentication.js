const
	Router = require('express').Router,
	auth = require('../services/authentication')
;

module.exports = Router({mergeParams: true})
.post('/login', auth.login)
.post('/register', auth.register)
.get('/logout', auth.logout)