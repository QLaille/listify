const PlaylistService = require('../services/playlist');
const UserService = require('../services/user');

async function index (req, res, next, user) {
	const playlists = await PlaylistService.playlistSearch(null, user.uid, null);
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
}

async function profilePage (req, res, next, user) {
	const playlists = await PlaylistService.playlistSearch(null, user.uid, null);
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
}

async function searchPage(req, res, next) {
	const searchTerm = req.query.search;
	const users = await UserService.searchUser(null, searchTerm);
	const playlists = await PlaylistService.playlistSearch(null, null, searchTerm);
	const songs = await PlaylistService.searchSong(searchTerm, null);
	const p = playlists.map((p) => {
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
}

async function createNewPlaylist(req, res, next, user) {
	await PlaylistService.createPlaylist(user.uid, req.body.name, (req.body.private ? true : false));
	res.redirect('/home');
}

function confirmPage(req, res, next) {
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

}

async function requestSongPage(req, res, next) {
	var s = null;

	if (req.params.id)
		s = await PlaylistService.searchSong(null, req.params.id);
	else if (req.body.name)
		s = await PlaylistService.searchSong(req.body.name, null);

	const context = {
		song: s
	};

	res.render('song', {
		layout: 'default',
		isLoggedIn: true,
		song: context.song
	});
}

async function showPlaylistPage(req, res, next, user) {
	const queryError = req.query.error ? "An error occurred on our end, please retry in a moment !" : "";
	const list = await PlaylistService.playlistSearch(req.params.id);

	if (!list) {
		res.render('404', {layout:'default'});
	} else {
		const creator = await UserService.searchUser(user.uid, null);
		const canAdd = (list.creator === user.uid) ? true : false;
		console.log(list);
		const context = {
			playlist: {
				name: list.name,
				songs: list.songs,
				creator: list.creator,
				id: list._id,
				private: list.private
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
}

async function addSongToPlaylist(req, res, next) { // two
	var r = null;
	const playlistId = req.params.id ? req.params.id : req.params.playlistId;

	if (req.params.songId) {
		const song = await PlaylistService.searchSong(req.body.name, req.params.songId);
		r = await PlaylistService.addSongToPlaylist(playlistId, song);
	} else {
		const song = await PlaylistService.searchSong(req.body.name, null);
		if (song.length > 1) {
			res.redirect(`/confirm?playlist=${playlistId}&choice=${JSON.stringify(song)}`);
			return;
		} else {
			if (song)
				r = await PlaylistService.addSongToPlaylist(playlistId, song[0]);
			else
				r = await PlaylistService.addSongToPlaylist(playlistId, req.body.name);
		}
	}
	if (r === false) { // incomplete
		res.redirect('/playlist/'+ playlistId + "?error=incomplete");
	} else if (r === null) {//server side error
		res.redirect('/playlist/'+ playlistId + "?error=us");
	} else {
		res.redirect('/playlist/'+ playlistId);
	}
}

module.exports = {
    index: index,
	profilePage: profilePage,
	showPlaylistPage: showPlaylistPage,
	createNewPlaylist: createNewPlaylist,
	addSongToPlaylist: addSongToPlaylist,
	searchPage:searchPage,
	requestSongPage:requestSongPage,
	confirmPage:confirmPage,
};