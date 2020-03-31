const passport = require('passport');
const playlist = require('../services/playlist');
const user = require('../services/user');


// TODO: error handling
async function index (req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		const playlists = await playlist.playlistSearch(null, user.username, null) // cache those playlists in case user clicks on one of them
		const context = {
			playlists: playlists.map(p => {
				return {
					name: p.name,
					id: p._id
				}
			})
		};

		res.render('home', {
			layout: 'default',
			isLoggedIn: true,
			playlists: context.playlists,
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
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}
		const profile = await user.searchUser(null, req.params.name);
		const playlists = await playlist.playlistSearch(null, req.params.name, null);
		const context = {
			playlists: playlists.map(p => {
				return {
					name: p.name,
					songs:p.songs,
					id: p.id
				}
			})
		};

		// console.log(profile)
		if (usr === req.params.name) {
			// add extra form for settings
		}
		res.render('profile', {
			layout: 'default',
			profile: req.params.name,
			isLoggedIn: true,
			playlists: context.playlists,
			allowProtoMethodsByDefault: true,
			allowProtoPropertiesByDefault: true
		});
	})(req,res,next);
}

/*
** //TODO  error handling
*/
async function showPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}
		const list = await playlist.playlistSearch(req.params.id);
		const context = {
			playlist: {
				name: list.name,
				songs: list.songs,
				creator: list.creator,
				id: list._id
			}
		}
		let canAdd = false;
		if (list.creator === usr.username)
			canAdd = true;

		if (!list) {
			// TODO 404 page
		} else {
			res.render('playlist', {
				layout: 'default',
				playlist: context.playlist,
				isLoggedIn: true,
				canAddSong: canAdd,
				allowProtoMethodsByDefault: true,
				allowProtoPropertiesByDefault: true
			});
		}
	})(req,res,next);


}

async function search(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}
		const searchTerm = req.query.search;
		let users = await user.searchUser(null, searchTerm);
		let playlists = await playlist.playlistSearch(null, null, searchTerm);

		// console.log(req.query)
		// console.log(playlists)
		let p = playlists.map((p) => {
			return {
				name: p.name,
				id: p._id,
			};
			// return p.toObject();
		});


		const context = {
			playlists: p,
			users: users
		};

		res.render('search', {
			layout: 'default',
			isLoggedIn: true,
			playlists: context.playlists,
			users: context.users
		});
	})(req,res,next);
}

function postNewPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		} else {
			playlist.createPlaylist(user.username, req.body.name);
			res.redirect('/home'); //redirect to newly created playlist ?
		}
	})(req,res,next);
}


async function addSongToPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}
		const r = await playlist.addSongToPlaylist(req.params.id, req.body.name);
		if (r === false) {
// song already in there
		} else if (r != true) {
			// error
		} else {
			res.redirect('/playlist/'+req.params.id);
		}
	})(req,res,next);

}

module.exports = {
    index: index,
	profile: profile,
	showPlaylist: showPlaylist,
	// showAllPlaylist: showAllPlaylist,
	postNewPlaylist: postNewPlaylist,
	addSongToPlaylist: addSongToPlaylist,
	search:search
};