const User = require('../database/models/user');
const bcrypt = require('bcrypt');

/* user */

// express-handlebars hasn't fix the issue of data rendering with an array of size 1,
// band-aid solution here:https://stackoverflow.com/questions/59753149/express-handlebars-wont-render-data
async function getUser(user) {
	 return User.find({"username": user.username})
	.lean()
	.then((user) => {
		if (!user)
			return {};
		else
			return user[0];
	});
}

async function createUser(userName, password, email) { // No ?
	if (typeof username != 'undefined' || typeof password != 'undefined' || typeof email != 'undefined') {
		return null;
	}
	// TODO minimal password size
	// TODO email not registered already
	const psswdHash = await bcrypt.hash(password, 10)
	const newUser = new User({username:username, password:psswdHash, userid: Date.now(), email:email})

	await newUser.save();
	return username;
}

async function deleteUser(username) { //TODO
	// TODO restrict to admin / local
	User.find({"username": username}, function(err, user) { // multiple usernames ? displayed names ?
// TODO find by id and delete
	});
}

/* names */

async function getUserName(userId) { // TODO
	User.find({'userid': userId}, function(err, user) {
		if (err) {
			return err;
		} else if (!user) {
			return null;
		} else {
			return user.username;
		}
	});
}

/*
** true / false / error
*/
async function changeUserName(user, newName) {
	return User.find({"username": user}, function(err, user) {
		if (err) {
			return err;
		} else if (!user) {
			return false;
		} else {
			user.username = newName;
			user.save((err) => {
				if (err) {
					return err;
				} else {
					return (true);
				}
			})
		}
	});
}

/* mail */

/*
** true / false / error
*/
async function getUserMail(userName) {
	return User.find({"username":userName}, function (err, user) {
		if (err) {
			return err;
		} else if (!user) {
			return null;
		} else {
			return user.email;
		}
	});
}

/*
** true / false / error
*/
async function changeUserMail(userName, newMail) {
	return User.find({"username": userName}, function(err, user) {
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

/* password */

async function changeUserPassword() { //TODO passport ? What ?

}

module.exports = {
	getUser: getUser,
	changeUserName: changeUserName,
	changeUserMail: changeUserMail
};