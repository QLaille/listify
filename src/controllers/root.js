const passport = require('passport');

function index (req, res, next) {
	res.render('index', {
		layout:'default',
	});
}

function login (req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (user !== false) {
			res.redirect('/home')
			return;
		}
		res.render('login', {
			layout:'default',
			SelfPage: true
		});

	})(req,res,next);

}

module.exports = {
    index: index,
	login: login
};