const { Connection, query } = require('stardog');
const fetch = require('node-fetch');

// const SparqlHttp = require('sparql-http-client');
// SparqlHttp.fetch = fetch;

const conn = new Connection({
  username: 'admin',
  password: 'admin',
  endpoint: 'http://localhost:5820',
});

const endpointUrl = 'http://dbtune.org/musicbrainz/sparql';
const musicBrainz = null;

function fetchMusicBrainz(rdf) {
const queryRDF = `
PREFIX mo: <http://purl.org/ontology/mo/>
PREFIX mbz: <http://purl.org/ontology/mbz#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX bio: <http://purl.org/vocab/bio/0.1/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX tags: <http://www.holygoat.co.uk/owl/redwood/0.1/tags/>
PREFIX geo: <http://www.geonames.org/ontology#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX lingvoj: <http://www.lingvoj.org/ontology#>
PREFIX rel: <http://purl.org/vocab/relationship/>
PREFIX vocab: <http://dbtune.org/musicbrainz/resource/vocab/>
PREFIX event: <http://purl.org/NET/c4dm/event.owl#>
PREFIX map: <file:/home/moustaki/work/motools/musicbrainz/d2r-server-0.4/mbz_mapping_raw.n3#>
PREFIX db: <http://dbtune.org/musicbrainz/resource/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX dc: <http://purl.org/dc/elements/1.1/>` + rdf;

	const queryUrl = endpointUrl+"?query="+encodeURIComponent(queryRDF)+"&output=json";
	return fetch(queryUrl);
}

module.exports = {
	localConnection: conn,
	localQuery: query,
	musicBrainz: fetchMusicBrainz
};