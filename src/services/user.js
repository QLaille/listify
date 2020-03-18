const User = require('../database/models/user');
const bcrypt = require('bcrypt');


async function createUser(userName = null, password = null, email = null) {
	if (userName === null || password === null || email === null)
		return (false);//Incomplete

	try {
	// TODO minimal password size && email not registered already
		const psswdHash = await bcrypt.hash(password, 10);
		const newUser = new User({username:userName, password:psswdHash, userid: Date.now(), email:email});

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
// TODO search users by search name term
	} else {
		return User
			.findById(id)
			.then((user) => {
				if (user !== null) {
					const safe = user.toObject();
					delete safe.password;
					delete safe.email;
					console.log(safe);
					return (safe); // Ok
				} else {
					return (false);//Nothing
				}

			})
			.catch((err) => {console.log(err); return null;})
		;
	}
}

function deleteUser(id = null) { //TODO restrict to admin / local
	if (id === null)
		return (false);//Incomplete

	return User
		.findByIdAndDelete(id)
		.then(() => {return true;}) // Ok
		.catch((err) => {console.log(err); return null;}) // Err
	;
}

function updateUserName(id = null, newName = null) {
	if (id === null || newName === null)
		return (false);//Incomplete

	return User
		.findByIdAndUpdate(id, {$set: {username: newName}})
		.then(() => {return true;})
		.catch((err) => {console.log(err); return null;})
	;
}

function updateUserMail(id = null, newMail = null) {
	if (id === null || newMail === null)
		return (false);//Incomplete

	return User
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