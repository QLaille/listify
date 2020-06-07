const
	PlaylistModel = require('../database/models/playlist'),
	UserService = require('./user'),
	ObjectId = require('mongoose').Types.ObjectId,
	RDF = require('../database/rdf.js')
;

function createPlaylist(userId = null, playlistName = null, privacy = false) {
	try {
		console.log(userId);
		console.log(playlistName);
		if (playlistName === null || userId === null)
			return (false);//Incomplete
		const user = UserService.searchUser(userId, null);
		if (user === null || user === false)
			return (false);

		const playlist = new PlaylistModel({name: playlistName, creator: userId, private: privacy});
		return playlist
			.save()
			.then((p) => {return p._id})//Ok
			.catch((err) => {console.log(err);return null})//Err
		;
	} catch (error) {
		console.log("Error occured when creating a playlist:");
		console.log(error);
		return (null);//Err
	}
}

function playlistSearch(id = null, creator = null, name = null) {
	if (id === null && creator === null && name === null)
		return (false); //Incomplete

	if (id !== null) {
		return PlaylistModel
			.findById(id)
			.then((playlist) => {return (playlist);})//Ok
			.catch((err) => {console.log(err); return (null);})//Err
		;
	} else if (creator !== null) {
		return PlaylistModel
			.find({"creator": creator})
			.then((playlists) => {return playlists;})//Ok
			.catch((err) => {console.log(err); return (null);})//Err
		;
	} else if (name !== null) {
		return PlaylistModel
			.find({"name": {$regex: name, $options: 'i'}, "private": false})
			.then((playlists) => {return playlists;})//Ok
			.catch((err) => {console.log(err); return (null);})//Err
		;
	}
}

function removePlaylist(playlistId = null) {
	if (playlistId === null)
		return false; //Incomplete

	return PlaylistModel
		.findByIdAndDelete(playlistId)
		.then(() => {return(true);})//Ok
		.catch((err) => {console.log(err); return null;})//Err
	;
}

function updatePlaylistName(id = null, newName = null) {
	if (id === null || newName === null)
		return false;//Incomplete

	return PlaylistModel
		.findOneAndUpdate({"_id": new ObjectId(id)}, {$set:{name: newName}})
		.then(() => {return true;})//Ok
		.catch((err) => {console.log(err); return null;})//Err
	;
}

function getSongsFromPlaylist(playlistId = null) {
	if (playlistId === null)
		return (false);// Incomplete

	return PlaylistModel
		.findById(playlistId)
		.then((playlist) => {return (playlist.songs);})//Ok
		.catch((err) => {console.log(err); return (null);})//Err
	;
}

function addSongToPlaylist(playlistId = null, newSong = null) {
	if (playlistId === null || newSong === null)
		return (false); //Incomplete

	return PlaylistModel
		.findByIdAndUpdate(playlistId, {$push: {songs:newSong}})
		.then(() => {return true;})//Ok
		.catch((err) => {console.log(err); return null;})//Err
	;
}

function removeSongFromPlaylist(playlistId = null, songId = null) {
	if (playlistId === null || songId === null)
		return (false); //Incomplete

	return PlaylistModel
		.findByIdAndUpdate(playlistId, {$pull: {songs:{id:songId}}})
		.then(() => {return true;})//Ok
		.catch((err) => {console.log(err); return null;})//Err
	;
}

function filterUniqueMBSongs(mbSongs) {
	var mbFilteredSongs = [];

	for (song of mbSongs) {
		filtered = mbFilteredSongs.filter(s => {return s.id === song.id})
		if (filtered.length === 0)
			mbFilteredSongs.push(song);
	}
	return (mbFilteredSongs);
}

async function handleSongSearch(requests) {

	var localSongs = requests[0].body.results.bindings.map((s) => {
		path = s.id.value;
		return {
			id: path.substr(path.lastIndexOf('/') + 1),
			title: s.title,
		};
	});

	const mbSongs = await Promise.all(requests[1].results.bindings.map(async (s) => {
		path = s.id.value;
		trackId = path.substr(path.lastIndexOf('/') + 1)
		subQuery = `SELECT DISTINCT ?property ?hasValue ?isValueOf WHERE {{ <http://dbtune.org/musicbrainz/resource/track/${trackId}> ?property ?hasValue }UNION{ ?isValueOf ?property <http://dbtune.org/musicbrainz/resource/track/${trackId}> }}ORDER BY (!BOUND(?hasValue)) ?property ?hasValue ?isValueOf`

		return RDF.musicBrainz(subQuery).then(async (res) => {
			trackJson = await res.json();
			return ({
				id: path.substr(path.lastIndexOf('/') + 1),
				title:trackJson.results.bindings[1].hasValue.type === "literal" ? trackJson.results.bindings[1].hasValue : "",
			});
		})
	}));

	const mbFilteredSongs = filterUniqueMBSongs(mbSongs);
	return (localSongs.concat(mbFilteredSongs));

}

function handleSingleSongSearch(id, ar) {
	if (id.match(/track-[0-9]{1,}/gm) != null) {
		return ({
			id: id,
			artist: ar[0].body.results.bindings[0].artist,
			title: ar[0].body.results.bindings[0].title
		});
	} else {
			const path = ar[0].results.bindings[7].hasValue.value
			const artistQuery = `SELECT DISTINCT ?property ?hasValue ?isValueOf WHERE { { <${path}> ?property ?hasValue }  UNION  { ?isValueOf ?property <${path}> }}ORDER BY (!BOUND(?hasValue)) ?property ?hasValue ?isValueOf`
			return RDF.musicBrainz(artistQuery).then(async (res) => {
				json = await res.json();
				label = json.results.bindings.find(elem => elem.property.value === "http://www.w3.org/2000/01/rdf-schema#label")
				return {
					id:id,
					artist:label.hasValue,
					title:ar[0].results.bindings[1].hasValue
				};
			})
	}
}

function searchSong(string = null, id = null) {
	var localQuery = "";
	var mbQuery = "";
	var promises = [];

	if (string === null && id === null)
		return (false); //Incomplete

	if (string) {
		localQuery = `select distinct ?id ?title where {?id a "mo:track"; dce:title ?title. FILTER(regex(str(?title), "${string}")).}`;
		mbQuery = `select distinct ?id WHERE {?id dc:title "${string}".} LIMIT 20`;
	} else {
		if (id.match(/track-[0-9]{1,}/gm) != null){ //if it matches, it is for the spotify db
			localQuery = `select distinct ?title ?artist where {:${id} dce:title ?title; mo:artist ?artist.}`;
		} else
			mbQuery = `SELECT DISTINCT ?property ?hasValue ?isValueOf WHERE { { <http://dbtune.org/musicbrainz/resource/track/${id}> ?property ?hasValue } UNION { ?isValueOf ?property <http://dbtune.org/musicbrainz/resource/track/${id}> } } ORDER BY (!BOUND(?hasValue)) ?property ?hasValue ?isValueOf`;
	}

	if (localQuery)
		promises.push(RDF.localQuery.execute(RDF.localConnection, 'spotify_top50', localQuery, 'application/sparql-results+json', {limit:10, offset:0}));
	if (mbQuery)
		promises.push(musicBrainz = RDF.musicBrainz(mbQuery).then(res=> res.json()));

	return Promise.all(promises).then(async (ar) => {
		if (ar.length > 1)
			return await handleSongSearch(ar);
		else
			return handleSingleSongSearch(id, ar);
	}).catch(err => {
		return []; // notify user that an error occurred ?
	});
}

module.exports = {
	createPlaylist: createPlaylist,
	playlistSearch: playlistSearch,
	removePlaylist: removePlaylist,
	updatePlaylistName: updatePlaylistName,
	getSongsFromPlaylist: getSongsFromPlaylist,
	addSongToPlaylist: addSongToPlaylist,
	removeSongFromPlaylist: removeSongFromPlaylist,
	searchSong: searchSong,
};