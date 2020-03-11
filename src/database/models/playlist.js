const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: String,
	id: String,
	creator: String,
	songs: [Object] // lastfm reference
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;