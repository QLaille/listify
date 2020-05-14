const passport = require('passport');
const playlist = require('../services/playlist');
const user = require('../services/user');

async function index (req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		const playlists = await playlist.playlistSearch(null, user.uid, null);
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
		var queryError = req.query.error ? "An error occurred on our end, please retry in a moment !" : "";

		let creator = 	await user.searchUser(usr.uid, null);
		const list = 	await playlist.playlistSearch(req.params.id);
		if (!list) {
			res.render('404', {layout:'default'});
		} else {
			const canAdd = (list.creator === usr.uid) ? true : false;
			const context = {
				playlist: {
					name: list.name,
					songs: list.songs,
					creator: list.creator,
					id: list._id
			}};
			res.render('playlist', {
				layout: 'default',
				playlist: context.playlist,
				canAddSong: canAdd,
				isLoggedIn: true,
				creator:creator.username,
				serverSideError: queryError,
				allowProtoMethodsByDefault: true,
				allowProtoPropertiesByDefault: true
			});
		}
	})(req,res,next);
}

async function search(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, usr, info) => {
		if (err != null || usr === false) {
			res.redirect('/login');
			return;
		}
		const searchTerm = req.query.search;

		let users = 	await user.searchUser(null, searchTerm);
		let playlists = await playlist.playlistSearch(null, null, searchTerm);
		let songs = 	await playlist.searchSong(searchTerm, null);

		let p = playlists.map((p) => {
			return {
				name: p.name,
				id: p._id,
			};
		});

		const context = {
			playlists: p,
			users: users,
			songs: songs
		};

		res.render('search', {
			layout: 'default',
			isLoggedIn: true,
			playlists: context.playlists,
			users: context.users,
			songs: context.songs
		});
	})(req,res,next);
}

async function postNewPlaylist(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
		} else {
			await playlist.createPlaylist(user.uid, req.body.name);
			res.redirect('/home');
		}
	})(req,res,next);
}

async function addSongToPlaylist(req, res, next) { // two
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		var r;

		if (req.params.songId && req.params.playlistId) {
			const song = await playlist.searchSong(req.body.name, req.params.songId);
			r = await playlist.addSongToPlaylist(req.params.playlistId, song);
		} else {
			const song = await playlist.searchSong(req.body.name, null);
			if (song.length > 1) {
				res.redirect(`/confirm?playlist=${req.params.id}&choice=${JSON.stringify(song)}`);
				return;
			} else {
				if (song)
					r = await playlist.addSongToPlaylist(req.params.id, song[0]);
				else
					r = await playlist.addSongToPlaylist(req.params.id, req.body.name);
			}
		}
		if (r === false) { // incomplete, do nothing
			res.redirect('/playlist/'+ req.params.id);
		} else if (r === null) {//server side error
			res.redirect('/playlist/'+ req.params.id + "?error=us");
		} else {
			res.redirect('/playlist/'+ req.params.id);
		}
	})(req,res,next);
}

function confirmPage(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		var arr = JSON.parse(req.query.choice);

		const context = {
			playlist: req.query.playlist,
			songs: arr
		};

		res.render('confirm', {
			layout: 'default',
			isLoggedIn: true,
			playlist:context.playlist,
			songs: context.songs
		});
	})(req,res,next);

}

async function songPage(req, res, next) {
	passport.authenticate('jwt', {session:false}, async (err, user, info) => {
		if (err != null || user === false) {
			res.redirect('/login')
			return;
		}
		var s = null;

		if (req.params.id)
			s = await playlist.searchSong(null, req.params.id);
		else if (req.body.name)
			s = await playlist.searchSong(req.body.name, null);

		const context = {
			song: s
		};

		res.render('song', {
			layout: 'default',
			isLoggedIn: true,
			song: context.song
		});
	})(req,res,next);
}

module.exports = {
    index: index,
	profile: profile,
	showPlaylist: showPlaylist,
	postNewPlaylist: postNewPlaylist,
	addSongToPlaylist: addSongToPlaylist,
	search:search,
	songPage:songPage,
	confirmPage:confirmPage,
};