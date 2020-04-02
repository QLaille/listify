const passport = require('passport');
const playlist = require('../services/playlist');
const user = require('../services/user');

async function index (req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		console.log(user);
		const playlists = await playlist.playlistSearch(null, user.uid, null)
		console.log(playlists);
		const context = {
			playlists: playlists ? playlists.map(p => {
				return {
					name: p.name,
					id: p._id
				}
			}) : null
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

async function profile (req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}
		const playlists = await playlist.playlistSearch(null, usr.uid, null);
		const context = {
			playlists: playlists ? playlists.map(p => {
				return {
					name: p.name,
					songs:p.songs,
					id: p._id
				}
			}) : null
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

async function showPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		if (err != null || usr === false) {
			res.redirect('/login')
			return;
		}
		let creator = await user.searchUser(usr.uid, null);
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
		if (list.creator === usr.uid)
			canAdd = true;

		if (!list) {
			// TODO 404 page
		} else {
			res.render('playlist', {
				layout: 'default',
				playlist: context.playlist,
				canAddSong: canAdd,
				isLoggedIn: true,

				creator:creator.username,
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

		let p = playlists.map((p) => {
			return {
				name: p.name,
				id: p._id,
			};
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

async function postNewPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		} else {
			await playlist.createPlaylist(user.uid, req.body.name);
			res.redirect('/home');
		}
	})(req,res,next);
}

async function addSongToPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		const r = await playlist.addSongToPlaylist(req.params.id, req.body.name);
		if (r === false) {
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
	postNewPlaylist: postNewPlaylist,
	addSongToPlaylist: addSongToPlaylist,
	search:search
};