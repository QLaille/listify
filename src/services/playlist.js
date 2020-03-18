const Playlist = require('../database/models/playlist');
var ObjectId = require('mongoose').Types.ObjectId;

function createPlaylist(userName = null, playlistName = null) { //TODO checking on username and playlist name (empty, duplicate, etc.)
	try {
		if (playlistName === null || userName === null)
			return (false);//Incomplete

		let playlist = new Playlist({name: playlistName, creator: userName});

		return playlist
			.save()
			.then((playlist) => {return playlist._id})//Ok
			.catch((err) => {console.log(err);return null})//Err
		;
	} catch (error) {
		console.log("Error occured when creating a playlist:");
		console.log(error);
		return (null);//Err
	}
}

function playlistSearch(id = null, creator = null, name = null) {
	if (id === null && (creator === null || name === null))
		return (false); //Incomplete

	if (id === null) {
		return Playlist
			.find({"creator": creator, "name": name})
			.then((playlists) => {return playlists;})
			.catch((err) => {console.log(err); return (null);})
		;
	} else {
		return Playlist
			.findById(id)
			.then((playlist) => {return (playlist);})
			.catch((err) => {console.log(err); return (null);})
		;
	}
}

function removePlaylist(playlistId = null) {
	if (playlistId === null)
		return false; //Incomplete

	return Playlist
		.findByIdAndDelete(playlistId)
		.then(() => {return(true);})//Ok
		.catch((err) => {console.log(err)})//Err
	;
}

// TODO Check for invalid playlist names
function updatePlaylistName(id = null, newName = null) {
	if (id === null || newName === null)
		return false;//Incomplete

	return Playlist
		.findOneAndUpdate({"_id": new ObjectId(id)}, {$set:{name: newName}})
		.then(() => {return true;})
		.catch((err) => {console.log(err); return null;})
	;
}

function getSongsFromPlaylist(playlistId = null) {
	if (playlistId === null)
		return (false);// Incomplete

	return Playlist
		.findById(playlistId)
		.then((playlist) => {return (playlist.songs);})
		.catch((err) => {console.log(err); return (null);})
	;
}

function addSongToPlaylist(playlistId = null, newSong = null) {
	if (playlistId === null || newSong === null)
		return (false); //Incomplete

	return Playlist
		.findByIdAndUpdate(playlistId, {$push: {songs:newSong}})
		.then(() => {return true;})
		.catch((err) => {console.log(err); return null;})
	;
}

function removeSongFromPlaylist(playlistId = null, name = null) {
	if (playlistId === null || name === null)
		return (false); //Incomplete

	return Playlist
		.findByIdAndUpdate(playlistId, {$pull: {songs:name}})
		.then(() => {return true;})
		.catch((err) => {console.log(err); return null;})
	;
}

module.exports = {
	createPlaylist: createPlaylist,
	playlistSearch: playlistSearch,
	removePlaylist: removePlaylist,
	updatePlaylistName: updatePlaylistName,
	getSongsFromPlaylist: getSongsFromPlaylist,
	addSongToPlaylist: addSongToPlaylist,
	removeSongFromPlaylist: removeSongFromPlaylist
};