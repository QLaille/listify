const
	Router = require('express').Router
;

const passport = require('passport');

module.exports = Router({mergeParams: true})
.put('/v1/users/:id/password', passport.authenticate('jwt', {session:false, failureRedirect:'/login'}), async (req,res,next) => {
	try {
		const user = await req.db.Users.findById(req.params.id); // to change
		user.password = req.body.password; // to hash / salt client side
		await user.save();
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});
