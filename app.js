require('dotenv').config();
//import User from './user';

const tmi = require('tmi.js');
const client = new tmi.Client({
	options: { /*debug: true, messagesLogLevel: "info" */},
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.TWITCH_USERNAME,
		password: process.env.TWITCH_PASSWORD
	},
	channels: [ '#cajamuro' ]
});
let commands = {};
let count = 0;
//let u = User('fulano');

commands['!hello'] = function(channel,tag){client.say(channel, `@${tag.username}, heya!`)};
commands['!bye'] = function(channel,tag){client.say(channel,`good bye, @${tag.username}`)};
commands['!count'] = function(channel,tag){
	count += 1;
	client.say(channel,`new count value = `+ count)
};

client.connect().catch(console.error);
client.on('message', (channel, tags, message, self) => {
	// console.log(channel);
	// console.log(tags);
	console.log(tags.username, 'said:', message);
	if(self) return;
	msg = message.toLowerCase();
	if(msg in commands){
		commands[msg](channel,tags);
	}

});