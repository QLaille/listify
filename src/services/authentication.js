const
	passport = require('passport'),
	bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	User = require('../database/models/user'),
	secret = require('../../secret')
;

function login(req, res, next) { // TODO error handling
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
		if (typeof username != 'undefined' || typeof password != 'undefined' || typeof email != 'undefined') {
			res.status(400).send({body:'Missing registration entry'});
			return;
		}
		// TODO minimal password size
		// TODO email not registered already
		const psswdHash = await bcrypt.hash(password, 10)
		const newUser = new User({username:username, password:psswdHash, userid: Date.now(), email:email})

		await newUser.save();
		res.status(200).send({ username });
	} catch (error) {
		console.log(error);
		res.status(400).send({});
	}
}

module.exports = {
	login: login,
	register: register
}