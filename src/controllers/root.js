function index (req, res) {
	res.render('index', {
		layout:'default',
	});
}

function about (req, res) {
	res.status(200).send('about');
}

function contact (req, res) {
	res.status(200).send('contact');
}

function login (req, res) {
	res.render('login', {
		layout:'default',
		SelfPage: true
	});
}

module.exports = {
    index: index,
    about: about,
	contact: contact,
	login: login
};