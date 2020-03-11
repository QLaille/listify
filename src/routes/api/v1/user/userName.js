const
	Router = require('express').Router
;

module.exports = Router({mergeParams: true})
.get('/v1/users/:id/name', async (req,res,next) => {
	try {
		const user = await req.db.Users.findById(req.params.id);
		if (user) {
			res.return(user.name);
		}
		res.sendStatus(404);
	} catch (error) {
		next(error);
	}
})
// .post('/v1/users/:id/name', )
.put('/v1/users/:id/name', async (req,res,next) => {
	try {
		const user = await req.db.Users.findById(req.params.id);
		user.name = req.body.name;
		await user.save();
		res.sendStatus(204);
	} catch (error) {
		next(error);
	}
})
// .delete('/v1/users/:id/name', async (req,res,next) => {
// 	try {
// 	//check if user is the user to delete
