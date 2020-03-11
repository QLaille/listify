const
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
.get('/v1/users/:id', async (req,res,next) => {
	try {
		const user = await req.db.Users.findById(req.params.id);

	} catch (error) {}
})
// .post('/v1/users/:id', )
.put('/v1/users/:id', async (req,res,next) => {
	try {
		// const user = await req.db.Users.findById(req.params.id);
		// user.email = req.body.email;
		// await user.save();
		// res.sendStatus(204);
	} catch (error) {
		next(error);
	}
})
// .delete('/v1/users/:id', )