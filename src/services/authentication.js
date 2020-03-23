const
	passport = require('passport'),
	bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	User = require('../database/models/user'),
	secret = require('../../secret'),
	userService = require('./user.js')
;

function login(req, res, next) { // TODO error handling && duplicate users
	try {
		passport.authenticate('local', {session:false}, (error, user) => {
			if (error || !user) {
				console.log(error);
				res.status(400).json({error});
			} else {
				const payload = {username: user.username, expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS)};
				req.login(payload, {session:false}, (error) => {
					if (error) {
						res.redirect('/'); // redirect to login but display an error
					} else {
						const token = jwt.sign(JSON.stringify(payload), secret.secretOrKey)
						res.header('Cache-Control', 'private');
						res.cookie('jwt', token, {httpOnly:true, hostOnly:true,secure:false});
						res.redirect('/home');
					}
				});
			}
		})(req,res);
	} catch (error) {
// error
	}
}

async function register(req,res,next) {
	try {
		const {username, password, email} = req.body;
		const ret = userService.createUser(username, password, email);
		if (ret === username) {
			res.status(200).send({ username }); //TODO redirect to home page
		} else {
			res.status(400).send({body:'Missing registration entry'});
			res.status(400).send({});//TODO
		}
		// if (typeof username != 'undefined' || typeof password != 'undefined' || typeof email != 'undefined') {
		// 	res.status(400).send({body:'Missing registration entry'});
		// 	return;
		// }
		// // TODO minimal password size
		// // TODO email not registered already
		// const psswdHash = await bcrypt.hash(password, 10)
		// const newUser = new User({username:username, password:psswdHash, userid: Date.now(), email:email})
	} catch (error) {
		console.log(error);
		res.status(400).send({});
	}
}

async function logout(req, res, next) {
	console.log(req.cookies);
	if (req.cookies.jwt) {
		res.clearCookie('jwt');
		res.redirect('/');
	} else {
		res.redirect('/login');
	}
}

module.exports = {
	login: login,
	register: register,
	logout: logout
}