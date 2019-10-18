const rp = require('request-promise-native');

/**
 * @typedef ChoonData
 * @prop {boolean} success If the request was successful in getting a track item
 * from Spotify via Choonz.
 * @prop {boolean} [shouldTTS] Whether or not to format with TTS (if the song is
 * currently playing).
 * @prop {string} [track] Formatted track name and artist.
 */

/**
 * @returns {ChoonData}
 */
async function getPlaying() {
	const { item, is_playing } = await rp({
		baseUrl: 'https://choonz.alca.tv/api/',
		url: `spotify/song/${process.env.CHOONZ_ID}`,
		json: true
	});
	if(!item) return { success: false };
	const title = item.name;
	const artist = item.artists.map(n => n.name).join(', ');
	const track = `${title} by ${artist}`;
	return {
		success: true,
		shouldTTS: is_playing,
		track: is_playing ? `Currently playing ${track}` : `Paused on ${track}`
	};
}

module.exports = {
	getPlaying
};