require('dotenv').config();
const User = require('./user.js');
const Viewer = require('./viewer.js');
const axios = require('axios').default;
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
	channels: [ process.env.CHANNEL ]
});
let u = new User(process.env.CHANNEL);

const MS = 1000;
const urlViewers = 'https://tmi.twitch.tv/group/user/'+u.name+'/chatters';

let commands = {};
let count = 0;
var viewersList = [];
var seconds = 10;
var timeViewer = seconds * MS;
let diffList = [];

u.setCommand('!hello',function(channel,tag){client.say(channel, `@${tag.username}, heya!`)});
u.setCommand('!bye',function(channel,tag){client.say(channel,`good bye, @${tag.username}`)});
u.setCommand('!count',function(channel,tag){
	count += 1;
	client.say(channel,`new count value = `+ count)
});


setInterval(function() {
	console.log('Interval reached every '+timeViewer/1000+' seconds');

	axios.get(urlViewers).then(function(response){
		diffList = viewersList.filter(d => !response.data.chatters.viewers.includes(d));
		viewersList = response.data.chatters.viewers

		for (viewer in viewersList){
			if (!(viewersList[viewer] in u.viewers)){
				u.viewers[viewersList[viewer]] = new Viewer(viewersList[viewer]);
			}
			if (u.viewers[viewersList[viewer]].online){
				u.viewers[viewersList[viewer]].watchtime += seconds;
			}
			u.viewers[viewersList[viewer]].online = true;
		}
		for (v in u.viewers){
			if (v in diffList){
				u.viewers[v].online = false;
			}
			console.log(u.viewers[v].name);
			console.log(u.viewers[v].watchtime +'s');
			((u.viewers[v].online) ? console.log('online\n') : console.log('offline\n'));
		}
	}).catch(function(error){console.log(error)});
}, timeViewer);

client.connect().catch(console.error);
client.on('chat', (channel, tags, message, self) => {
	//console.log(channel);
	//console.log(tags);
	console.log(tags.username, 'said:', message);
	if(self) return;
	msg = message.toLowerCase();
	if(msg in u.commands){
		u.commands[msg](channel,tags);
	}
});