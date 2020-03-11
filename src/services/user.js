const User = require('../database/models/user');

async function getUser(user) {
	 // express-handlebars hasn't fix this issue, band-aid solution here:https://stackoverflow.com/questions/59753149/express-handlebars-wont-render-data
	 return User.find({"username": user.username})
	.lean()
	.then((user) => {
		if (!user)
			return {};
		else
			return user[0];
	});
}

async function changeUserName(user, newName) {
	return User.find({"username": user}, function(err, user) {
		if (err || !user) {
			// err
		} else {
			user.username = newName;
			user.save((err) => {
				if (err) {
					// err
				} else {
					return (true);
				}
			})
		}
	});
}

async function changeUserMail(user, newMail) {
	return User.find({"username": user}, function(err, user) {
		if (err || !user) {
			// err
		} else {
			user.email = newMail;
			user.save((err) => {
				if (err) {
					// err
				} else {
					return (true);
				}
			})
		}
	});
}

module.exports = {
	getUser: getUser,
	changeUserName: changeUserName,
	changeUserMail: changeUserMail
};