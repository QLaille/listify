const
	passport = require('passport'),
	bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	User = require('../database/models/user'),
	secret = require('../../secret'),
	userService = require('./user.js')
;

function login(req, res, next) {
	try {
		passport.authenticate('local', {session:false}, (error, user) => {
			if (error) {
				console.log(error);
				res.status(500).redirect('/login?error=' + "us")
			} else if (!user) {
				res.status(400).redirect('/login?error=' + "noone");

			} else {
				date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

				const payload = {uid: user.userid, expires: date};
				req.login(payload, {session:false}, (error) => {
					if (error) {
						res.redirect("/login?error=wrong");
					} else {
						const token = jwt.sign(JSON.stringify(payload), secret.secretOrKey)
						res.header('Cache-Control', 'private');
						res.cookie('jwt', token, {httpOnly:true, hostOnly:true,secure:false});
						res.redirect('/home');
					}
				});
			}
		})(req,res, next);
	} catch (error) {
		console.log(error);
		res.redirect("/login?error=us");
	}
}

async function register(req,res,next) {
	try {
		const {username, password, email} = req.body;

			const ret = await userService.createUser(username, password, email);
			console.log(ret)
			if (typeof ret === "string") {
				switch (ret) {
					case "exist":
						res.redirect('/login?error=exist')
						break;
					case "email":
						res.redirect('/login?error=email')
						break;
					case "password":
						res.redirect('/login?error=psswd')
						break;
					case "username":
						res.redirect('/login?error=usern')
						break;
					default:
						break;
				}
			} else if (ret !== false && ret !== null) {
				const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
				const payload = {uid: ret, expires: date};

				req.login(payload, {session:false}, (error) => {
					if (error) {
						res.redirect('/login?error=' + "us");
					} else {
						const token = jwt.sign(JSON.stringify(payload), secret.secretOrKey)

						res.header('Cache-Control', 'private');
						res.cookie('jwt', token, {httpOnly:true, hostOnly:true,secure:false});
						res.redirect('/home');
					}
				});
			} else if (ret === false) {
				res.redirect("/login?error=missing");
			} else {
				res.redirect("/login?error=us");
			}
	} catch (error) {
		console.log(error);
		res.redirect("/login?error=us");
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