const
	bcrypt = require('bcrypt'),
	UserModel = require('../database/models/user')
;

async function createUser(username = null, password = null, email = null) {
	if (username === null || password === null || email === null)
		return (false);//Incomplete

	try {
		users = await searchUser(null, username);
		if (users !== false && users !== null && users.length !== 0) {
			return ("exist");
		}
		emailCheck = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}")
		usernCheck = new RegExp(".{7,32}")
		psswdCheck = new RegExp(/^(?=.*[0-9A-Za-z])(?=.*\d)[0-9A-Za-z\d]{12,}$/g)
		if (!emailCheck.test(email)) {
			return ("email");
		} else if (!psswdCheck.test(password)) {
			return ("password");
		} else if (!usernCheck.test(username)) {
			return ("username");
		}

		const psswdHash = await bcrypt.hash(password, 10);
		const newUser = new UserModel({username:username, password:psswdHash, userid: Date.now(), email:email});

		return newUser
			.save()
			.then((user) => {return (user._id);}) //Ok
			.catch((err) => {console.log(err); return (null);}) //Err
		;
	} catch (error) {
		console.log("Error occured when creating a user:");
		console.log(error);
		return (null);//Err
	}
}

function searchUser(id = null, name = null) {
	if (id === null && name === null)
		return (false);//Incomplete

	if (id === null) {
		return UserModel
			.find({"username": {$regex: name, $options: 'i'}})
			.then((users) => {
				const safe = users.map(user => {
					const u = user.toObject();
					delete u.password;
					delete u.email;
					return u;
				});
				return safe;
			})
			.catch((err) => {console.log(err); return null;})
		;
	} else {
		return UserModel
			.find({"userid": {$regex: id}})
			.then((user) => {
				if (user !== null) {
					const safe = user[0].toObject();
					delete safe.password;
					delete safe.email;
					return (safe); // Ok
				} else {
					return (false);//Nothing
				}

			})
			.catch((err) => {console.log(err); return null;})
		;
	}
}

function deleteUser(id = null, secret = null) {
	if (secret === null) {
		return false;
	}
	if (id === null)
		return (false);//Incomplete

	return UserModel
		.findByIdAndDelete(id)
		.then(() => {return true;}) // Ok
		.catch((err) => {console.log(err); return null;}) // Err
	;
}

function updateUserName(id = null, newName = null) {
	if (id === null || newName === null)
		return (false);//Incomplete

	return UserModel
		.findByIdAndUpdate(id, {$set: {username: newName}})
		.then(() => {return true;})
		.catch((err) => {console.log(err); return null;})
	;
}

function updateUserMail(id = null, newMail = null) {
	if (id === null || newMail === null)
		return (false);//Incomplete

	return UserModel
		.findByIdAndUpdate(id, {$set: {email: newMail}})
		.then(() => {return true;})
		.catch((err) => {console.log(err); return null;})
	;
}

module.exports = {
	createUser: createUser,
	searchUser: searchUser,
	deleteUser: deleteUser,
	updateUserName: updateUserName,
	updateUserMail: updateUserMail
};