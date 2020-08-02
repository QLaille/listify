const
	Router = require('express').Router,
	user = require('../../../../services/user'),
;
const passport = require('passport');

module.exports = Router({mergeParams: true})
// create new user
.post('/v1/user', async (req,res,next) => {
	const {name, password, email} = req.body;

	let ret = await user.createUser(name, password, email);

	if (ret === null)
		res.sendStatus(500);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.send(ret);
})
// search ONE(1) user by id
.get('/v1/user', async (req,res,next) => {
	const id = req.body.id;
	const name = req.body.name;

	let ret = await user.searchUser(id, name);
	if (ret === null)
		res.sendStatus(500);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.send(ret);
})
// delete one user
.delete('/v1/user', passport.authenticate('jwt', {session:false, , failureRedirect:'/login'}), async (req,res,next) => {
// TODO check if user to modify is same as the one logged in
const id = req.body.id;

	let ret = await  user.deleteUser(id);

	if (ret === null)
		res.sendStatus(500);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.sendStatus(200);
})
// change user name
.put('/v1/user/name', passport.authenticate('jwt', {session:false, , failureRedirect:'/login'}), async (req,res,next) => {
// TODO check if user to modify is same as the one logged in
	const id = req.body.id;
	const newName = req.body.name;

	let ret = await user.updateUserName(id, newName);
	if (ret === null)
		res.sendStatus(500);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.sendStatus(200);
})
// change user email
.put('/v1/user/mail', passport.authenticate('jwt', {session:false, , failureRedirect:'/login'}), async (req,res,next) => {
// TODO check if user to modify is same as the one logged in
	const id = req.body.id;
	const newMail = req.body.mail;

	let ret = await  user.updateUserMail(id, newMail);
	if (ret === null)
		res.sendStatus(500);
	else if (ret === false)
		res.sendStatus(400);
	else
		res.sendStatus(200);
})