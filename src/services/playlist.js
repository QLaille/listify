const Playlist = require('../database/models/playlist');

/*
** create playlist for a user
*/
async function createPlaylist(userName, playlistName) {
	try {
		return Playlist.find({"creator": userName, "name": playlistName}, async (err, playlist) => {
			if (err) {
				return (err);
			} else if (!playlist) {
				const newPlaylist = new Playlist({name:playlistName, creator: userName})
				await newPlaylist.save();
				return (true);
			} else {
				return (false);
			}
		});
	} catch (error) {
		// err
	}
}

/*
** get all playlists from a user
**
*/
async function getUserAllPlaylist(user) {// TODO

	if (!user.username)
		return ([]);
	return Playlist.find({"creator": user.username}, function (err,playlists) {
		if (err || !playlists)
			return ([]);
		else
			return (playlists);
	})
}

/*
** get all playlists from a user and return the names
*/
async function getUserAllPlaylistName(user) {
	console.log(user)
	return Playlist.distinct("name", {'creator': user.username}, function (err, names) {
		console.log("oui")
		console.log(err)
		console.log("oui")
		if (err || !names) {
			// err
		} else {
			return (names);
		}
	});
}

/*
** find a playlist from a user by name
*/
async function getUserPlaylistByName(user, playlistName) {
	return Playlist.find({"creator": user, "name": playlistName})
	.lean()
	.then((playlist) => {
		if (!playlist)
			return ({});
		else
			return (playlist[0]);
	});
}

/*
** get songs of a playlist
*/
async function getPlaylistSongs(playlistName) {
	return Playlist.find({"name": playlistName}, function (err, playlist) {
		if (err || !playlist) {
			// err
		} else {
			return (playlist.songs);
		}
	});
}

/*
** remove a playlist by id
*/
function removePlaylist(id) {
	Playlist.deleteOne({"id": id}, function (err) {
		if (err) {
			return (err);
		} else {
			return (true);
		}
	});
}

/*
** remove a song from a playlist by its name
*/
function removeSongFromPlaylist(playlistName, entry) {
	Playlist.find({"name": playlistName}, function (err, playlist) {
		if (err || !playlist) {
			return (false);
		} else {
			playlist.songs.filter((song) => {
				if (song instanceof String) {
					return (song !== entry);
				} else {
					return (false) //TODO lastFM object
				}
			});
			playlist.save((err) => {
				if (err) {
					return (err);
				} else {
					return (true);
				}
			})
		}
	});
}

/*
** add song to a playlist
*/
async function addSongToPlaylist(playlistName, entry) {
	console.log(playlistName);
	return Playlist.find({"name": playlistName}, function (err, playlist) { //TODO change for playlist recognition by ID
		if (err || !playlist) {
			// err
		} else {
			if (!entry in playlist[0].songs) {
				playlist[0].songs.push(entry); //TODO: change that with lastFm when available
				playlist[0].save((err) => {
					if (err) {
						return (err);
					} else {
						return (true);
					}
				})
			} else {
				return (false);
			}
		}
	});
}

async function searchPlaylist(search=null) { // TODO
	if (search === null) {
// err or ignore ?
	} else {
		Playlist.find({}); // by name, creator
	}
}

module.exports = {
	createPlaylist: createPlaylist,
	getUserAllPlaylist: getUserAllPlaylist,
	getUserAllPlaylistName: getUserAllPlaylistName,
	getUserPlaylistByName: getUserPlaylistByName,
	getPlaylistSongs: getPlaylistSongs,
	removePlaylist: removePlaylist,
	removeSongFromPlaylist: removeSongFromPlaylist,
	addSongToPlaylist: addSongToPlaylist,
	searchPlaylist:searchPlaylist
};