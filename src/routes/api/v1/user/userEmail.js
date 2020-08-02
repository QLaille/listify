const
	Router = require('express').Router,
	user = require('../../../../services/user'),
;
const passport = require('passport');

module.exports = Router({mergeParams: true})
.put('/v1/user/mail', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), async (req,res,next) => {
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