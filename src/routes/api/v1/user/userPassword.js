const
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
// .get('/v1/users/:id/password', )
// .post('/v1/users', )
.put('/v1/users/:id/password', async (req,res,next) => {
	try {
		const user = await req.db.Users.findById(req.params.id); // to change
		user.password = req.body.password; // to hash / salt client side
		await user.save();
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
});
// .delete('/v1/users', )
