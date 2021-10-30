import { Client, Intents } from 'discord.js';
import config from './config.json';

export default async () => {
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
  client.player = player;

  client.on('ready', async () => {
    console.log("The bot is ready!");
  })

  const botConfig = { prefix: '@' };
  client.on('messageCreate', async (message) => {
    if (message.content.split('')[0] === '@') {
      console.log(message.content);
      const args = message.content.slice(botConfig.prefix.length).trim().split(/ +/g);
      const command = args.shift();
      let guildQueue = client.player.getQueue(message.guild.id);

      if (commands[command]) {
        commands[command](client, guildQueue, message, args);
      } else {
        message.reply(`[Reply] Comando "${command}" não foi encontrado. Utilize "commands" para ter acesso à lista de comandos.`);
      }
    }
  });

  client.login(config.token);
}

export const commands = {
  'play': async (client, gQueue, msg, args) => {
    try {
      let queue = client.player.createQueue(msg.guild.id);
      await queue.join(msg.member.voice.channel);

      try {
        if (args[0].includes('list')) {
          await queue.playlist(args.join(' ')).catch(_ => {
            if (!guildQueue)
              queue.stop();
          });
        } else {
          await queue.play(args.join(' ')).catch(_ => {
            if (!guildQueue)
              queue.stop();
          });
        }
      } catch (e) {
        console.log(e);
      }
    } catch (e) { console.log(e); }
  },
  'skip': (client, gQueue, msg, args) => {
    try { gQueue.skip(); } catch (e) { console.log(e); }
  },
  'stop': (client, gQueue, msg, args) => {
    try { gQueue.stop(); } catch (e) { console.log(e); }
  },
  'suffle': (client, gQueue, msg, args) => {
    try { gQueue.suffle(); } catch (e) { console.log(e); }
  },
  'pause': (client, gQueue, msg, args) => {
    try { gQueue.setPaused(true); } catch (e) { console.log(e); }
  },
  'resume': (client, gQueue, msg, args) => {
    try { gQueue.setPaused(false); } catch (e) { console.log(e); }
  },
  'commands': (client, gQueue, msg, args) => {
    try {
      msg.reply("```@play [link]\nTocar músicas e playlists.\n\n@skip\nPular uma música da fila.\n\n@stop\nParar de reproduzir e sair da sala.\n\n@suffle\nTocar músicas em ordem aleatória.\n\n@pause\nPausar reprodução\n\n@resume\nRetormar reprodução.\n\n```")
    } catch (e) {
      console.log(e);
    }
  }
}