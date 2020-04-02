const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcrypt');

const User = require('../database/models/user');
const secret = require('../../secret');

passport.use(new LocalStrategy(function (username, password, done) {
	try {
		User.findOne({username:username}, (err, user) => {
			if (user) {
				bcrypt.compare(password, user.password, (err, match) => {
					if (match) {
						return done(null, user);
					} else {
						return done('Incorrect login');
					}
				});
			} else {
				return done("No User");
			}
		});
	} catch (error) {
// error
	}
}));

var retrieveCookie = function(req) {
	return (req && req.cookies && req.cookies['jwt']) ? req.cookies['jwt'] : null;
  };

passport.use(new JWTStrategy({
	jwtFromRequest: retrieveCookie,
	secretOrKey: secret.secretOrKey
}, (payload, done) => {
	if (payload.expires && Date.now() > payload.expires) {
		return done('token expired');
	} else {
		return done(null, payload);
	}
}));

passport.serializeUser(function(user, cb) {
	cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
	cb(null, obj);
});

