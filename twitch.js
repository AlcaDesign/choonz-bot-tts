const {
	TWITCH_CHAN,
	TWITCH_NAME,
	TWITCH_PASS,
	COMMAND_NAME = '!choon',
	TTS_COMMAND_NAME = '!tts'
} = require('dotenv').config().parsed;

const tmi = require('tmi.js');
const api = require('./api');

let lastSpoke = -Infinity;

/** @type {import('tmi.js').Client} */
const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: TWITCH_NAME,
		password: TWITCH_PASS
	},
	channels: [ TWITCH_CHAN ]
});

client.on('message', async (channel, tags, message, self) => {
	if(self || message.toLowerCase() !== COMMAND_NAME) {
		return;
	}
	const now = Date.now();
	if(lastSpoke + 5000 > now) {
		return;
	}
	lastSpoke = now;
	const { success, shouldTTS, track } = await api.getPlaying();
	if(success) {
		client.say(channel, `${shouldTTS ? TTS_COMMAND_NAME : ''} ${track}`);
	}
});

client.connect();