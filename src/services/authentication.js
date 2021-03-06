const
	UserService = require('./user.js'),
	Passport = require('passport'),
	secret = require('../../secret'),
	JWT = require('jsonwebtoken')
;

function loginUser(req, res, next) {
	try {
		Passport.authenticate('local', {session:false}, (error, user) => {
			if (error) {
				console.log(error);
				res.status(500).redirect('/login?error=' + "us")
			} else if (!user) {
				res.status(400).redirect('/login?error=' + "noone");
			} else {
				const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); //TODO check how to renew a jwt token
				const payload = {uid: user.userid, expires: date};

				req.login(payload, {session:false}, (error) => {
					if (error) {
						res.redirect("/login?error=wrong");
					} else {
						const token = JWT.sign(JSON.stringify(payload), secret.secretOrKey);

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

async function registerNewUser(req,res,next) {
	try {
		const {username, password, email} = req.body;
		const ret = await UserService.createUser(username, password, email);

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
					const token = JWT.sign(JSON.stringify(payload), secret.secretOrKey)

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

async function logoutUser(req, res, next) {
	if (req.cookies.jwt) {
		res.clearCookie('jwt');
		res.redirect('/');
	} else {
		res.redirect('/login');
	}
}

// function authenticate(req, res, next) {
// 	// console.log(req.cookies);
// 	// console.log("oui");
// 	// console.log(req.isAuthenticated());

// // 	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
// // 		if (err != null || user === false) {
// // 			res.redirect('/login')
// // 			return;
// // 		}
// // 		HomeController.profilePage(req,res,next,user);
// // 	})(req,res, next);
// 	// passport.authenticate('jwt', {session:false}, async (err, user, info) => {

// 	// })(req,res, next);

//     if (req.isAuthenticated()) {
// 		console.log(req.user);
// 		console.log("oui")
//         return next();
//     } else {
// 		console.log("oui")
//         res.redirect('/login');
//     }
// }

// function confirmIdentity(req, res, next) {
// 	authenticate();

// 	if (req.params.id) {
// 		console.log(req.cookies);
// 		// if (req.params.id === req.cookies)
// 	} else { //TODO
// 		res.redirect('/login')
// 	}
// 	// check identity
// }

module.exports = {
	login: loginUser,
	register: registerNewUser,
	logout: logoutUser
}