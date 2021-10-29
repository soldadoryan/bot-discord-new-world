import { Client, Intents } from 'discord.js';
import config from './config.json';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES
  ], shards: "auto"
});

const { Player } = require("discord-music-player");
const player = new Player(client, {
  leaveOnEmpty: false, // This options are optional.
});
// You can define the Player as *client.player* to easly access it.
client.player = player;

client.on('ready', async () => {
  console.log("The bot is ready!");


})

const { RepeatMode } = require('discord-music-player');

const botConfig = {
  prefix: '!'
}

client.on('messageCreate', async (message) => {
  console.log(message.content);
  const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
  const command = args.shift();
  let guildQueue = client.player.getQueue(message.guild.id);

  if (command === 'play') {
    let queue = client.player.createQueue(message.guild.id);
    await queue.join(message.member.voice.channel);
    let song = await queue.play(args.join(' ')).catch(_ => {
      if (!guildQueue)
        queue.stop();
    });
  }

  if (command === 'playlist') {
    let queue = client.player.createQueue(message.guild.id);
    await queue.join(message.member.voice.channel);
    let song = await queue.playlist(args.join(' ')).catch(_ => {
      if (!guildQueue)
        queue.stop();
    });
  }

  if (command === 'skip') {
    guildQueue.skip();
  }

  if (command === 'stop') {
    guildQueue.stop();
  }

  if (command === 'removeLoop') {
    guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
  }

  if (command === 'toggleLoop') {
    guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
  }

  if (command === 'toggleQueueLoop') {
    guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
  }

  if (command === 'setVolume') {
    guildQueue.setVolume(parseInt(args[0]));
  }

  if (command === 'seek') {
    guildQueue.seek(parseInt(args[0]) * 1000);
  }

  if (command === 'clearQueue') {
    guildQueue.clearQueue();
  }

  if (command === 'shuffle') {
    guildQueue.shuffle();
  }

  if (command === 'getQueue') {
    console.log(guildQueue);
  }

  if (command === 'getVolume') {
    console.log(guildQueue.volume)
  }

  if (command === 'nowPlaying') {
    console.log(`Now playing: ${guildQueue.nowPlaying}`);
  }

  if (command === 'pause') {
    guildQueue.setPaused(true);
  }

  if (command === 'resume') {
    guildQueue.setPaused(false);
  }

  if (command === 'remove') {
    guildQueue.remove(parseInt(args[0]));
  }

  if (command === 'createProgressBar') {
    const ProgressBar = guildQueue.createProgressBar();

    // [======>              ][00:35/2:20]
    console.log(ProgressBar.prettier);
  }
})

client.login(config.token);