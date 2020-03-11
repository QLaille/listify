const passport = require('passport');
const playlist = require('../services/playlist');
const user = require('../services/user');

/*
** Show all the playlists of the user on arrival
** // TODO: error handling
** Playlist names instead ?
*/
async function index (req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		playlists = await playlist.getUserAllPlaylist(user)

		res.render('home', {
			layout: 'default',
			playlists: playlists,
			allowProtoMethodsByDefault: true,
			allowProtoPropertiesByDefault: true
		});
	})(req,res,next);
}

/*
** Profile of user
** // TODO: if profile page is current user, add extra form for settings
*/
async function profile (req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		profile = await user.getUser(usr);
		playlists = await playlist.getUserAllPlaylist(user);

		if (usr === req.params.name) {
			// add extra form for settings
		}
		res.render('profile', {
			layout: 'default',
			profile: profile,
			playlists: playlists,
			allowProtoMethodsByDefault: true,
			allowProtoPropertiesByDefault: true
		});
	})(req,res,next);
}

// TODO move that to index in a form hidden by a css ?
function newPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err) {
// err
		} else {
			playlist.createPlaylist(user.username, req.body.name);
			res.redirect('/home');
			// res.render('newPlaylist', {
			// 	layout: 'default',
			// 	allowProtoMethodsByDefault: true,
			// 	allowProtoPropertiesByDefault: true
			// })
		}
	})(req,res,next);
}

/*
** Find playlist by username and playlist name
** //TODO make that function handle multiple params (if existing), error handling
*/
async function showPlaylist(req, res, next) {
	const list = await playlist.getUserPlaylistByName(req.params.user, req.params.name);
	if (!list) {
// err
	} else {
		console.log(list)
		res.render('playlist', {
			layout: 'default',
			playlist: list,
			allowProtoMethodsByDefault: true,
			allowProtoPropertiesByDefault: true
		});
	}
}

/*
** Find all playlists of a user
** //TODO: error handling
*/
async function showAllPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		const list = await playlist.getUserAllPlaylist(user);
		if (!list) {
			// err
		} else {

			res.render('allPlaylist', {
				layout: 'default',
				playlists: list,
				allowProtoMethodsByDefault: true,
				allowProtoPropertiesByDefault: true
			});
		}
	})(req,res,next);
}

async function addSongToPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		const r = await playlist.addSongToPlaylist(req.params.name, req.body.name);
		if (r === false) {
// song already in there
		} else if (r != true) {
			// error
		} else {
			res.redirect('/home/'+user.username+'/playlist/'+req.params.name);
		}
	})(req,res,next);

}

module.exports = {
    index: index,
	profile: profile,
	newPlaylist: newPlaylist,
	showPlaylist: showPlaylist,
	showAllPlaylist: showAllPlaylist,
	addSongToPlaylist: addSongToPlaylist
};