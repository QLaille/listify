const
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
.put('/v1/users/:id/email', async (req,res,next) => {
	try {
		const user = await req.db.Users.findById(req.params.id);
		user.email = req.body.email;
		await user.save();
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
})
// .delete('/v1/users/:id/email', )