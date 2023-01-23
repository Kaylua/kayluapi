// Setup Discord
const functions = require('./functions')
const PREFIX = '$'
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates
    ]
});

function getReason(args) {
  let reason =""
  args.forEach(arg => {
    if(!arg.startsWith('<@!')) {
      reason = reason.concat(`${arg} `);
    }
  })
  return val = reason.trim()
}

// On Message
client.on('message', (msg) => {
  // Don't let other bots execute commands
  if(msg.author.bot) return;
  
  // Ensure command starts with proper prefix
  if(msg.content.startsWith(PREFIX)) {
    const [command, ...args] = msg.content
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);
    
    /* Command Handling */
    const cmd = command.toUpperCase();
    
    // KICK
    if(cmd === 'KICK') {
      if(!msg.member.hasPermission('KICK_MEMBERS')) {
        console.error(`Member ${msg.member} does not have kick permissions`)
        return;
      } else {
        const reason = getReason(args);
        msg.mentions.users.forEach(taggedUser => {
          functions.kick(msg.guild.member(taggedUser).id, msg.guild.id, reason)
        })
      }
    }
    
    // BAN
    if(cmd === 'BAN') {
      if(!msg.member.hasPermission('BAN_MEMBERS')) {
        console.error(`Member ${msg.member} does not have ban permissions`)
      } else {
        const reason = getReason(args)
        msg.mentions.users.forEach(taggedUser => {
          functions.ban(msg.guild.member(taggedUser).id, msg.guild.id, reason)
        })
      }
    }
    
    // DISS
    if(cmd === 'DISS') {
      functions.diss(msg.channel.id, args[0])
    }
    
    // test
    if(cmd === 'youtube') {
        functions.ban(msg.channel.id, args[0])
    }
  }
});

// On Ready
client.on('ready', async () => {
  console.log(`${client.user.tag} is online!!`)
});

// Login Thread
client.login(process.env.DISCORD_BOT_TOKEN)

exports.client = client;