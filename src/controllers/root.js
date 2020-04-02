const passport = require('passport');

function index (req, res, next) {
	res.render('index', {
		layout:'default',
	});
}

function login (req, res, next) {

	var queryError = req.query.error ? req.query.error : "";
	var errorMsg = "";

	switch (queryError) {
		case "us":
			errorMsg = "An error occured on our side, please retry in a moment."
			break;
		case "noone":
			errorMsg = "No one with that username exists, please retry."
			break;
		case "wrong":
			errorMsg = "No one with that username exists, please retry."
			break;
		case "missing":
			errorMsg = "We are missing either the email, username or password, please retry."
			break;
		case "exist":
			errorMsg = "Somebody with that name/email already exists."
			break;
		case "psswd":
			errorMsg = "Your password doesn't match our criterias, please change it and retry."
			break;
		case "usern":
			errorMsg = "Your username doesn't match our criterias, please change it and retry."
			break;
		case "email":
			errorMsg = "Your email doesn't match our criterias, please change it and retry."
			break;
		default:
			break;
	};

	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (user !== false) {
			res.redirect('/home')
			return;
		}
		res.render('login', {
			layout:'default',
			SelfPage: true,
			errorMsg: errorMsg
		});

	})(req,res,next);

}

module.exports = {
    index: index,
	login: login
};