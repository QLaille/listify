const
	Router = require('express').Router
	authService = require('../../../services/authentication')
;

module.exports = Router({mergeParams: true})
.post('/v1/auth/login', authService.login)
.post('/v1/auth/register', authService.register)
.post('/v1/auth/logout', authService.logout)