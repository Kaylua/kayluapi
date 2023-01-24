const discord = require('./discordmain')
const { ChannelType } = require('discord.js')
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus, generateDependencyReport, NoSubscriberBehavior } = require('@discordjs/voice');
const play = require('play-dl');
const mongoose = require('mongoose');

function hasLetterOrNumber(str) {
  return /[a-zA-Z]/.test(str) || /\d/.test(str);
}

async function getTime(){

  var date = new Date;

  return date;
}

async function getDate(){
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  
  let currentDate = `${month}-${day}-${year}`;

  return currentDate;
}

async function getHour(){
  var date = new Date;

  var seconds = date.getSeconds();
  var minutes = date.getMinutes();
  var hour = date.getHours();
  let currentTime = `${hour}:${minutes}:${seconds}`;

  return currentTime;
}
// stopsound
async function stopsound(guildID) {
  try {    
    const connection = getVoiceConnection(guildID)
    connection.state.subscription.player.stop()
  } catch (err) {
    console.error(err)
    throw err
  }
}

// playsound
async function playsound(guildID, path) {
  try {    
    const player = createAudioPlayer()
    
    player.on('error', error => {
      console.error(`Error: ${error.message} with resource`);
    });
    
    const resource = createAudioResource(path);
    
    player.play(resource);
    
    const connection = getVoiceConnection(guildID)
    
    const subscription = connection.subscribe(player)

    // if (subscription) {
		// 	// Unsubscribe après 5 secondes (arrête de jouer l'audio sur la voice connection)
		// 	setTimeout(() => subscription.unsubscribe(), 30_000);
		// }
    
  } catch (err) {
    console.error(err)
    throw err
  }
}

// playsoundYTB
async function playsoundYTB(guildID, linkYTB) {
  try {    
    let args = linkYTB
    let yt_info = await play.search(args, {
      limit: 1
    })
    
    let stream = await play.stream(yt_info[0].url)
    
    let resource = createAudioResource(stream.stream, {
      inputType: stream.type
    })
    
    let player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play
      }
    })
    
    player.play(resource)
    
    const connection = await getVoiceConnection(guildID)
    
    const subscription = await connection.subscribe(player)
    
  } catch (err) {
    console.error(err)
    throw err
  }
}

// leavechannel
async function leavechannel(guildID) {
  try {
    const connection = getVoiceConnection(guildID);
    connection.destroy()
  } catch (err) {
    console.error(err)
    throw err
  }
}

// joinchannel
async function joinchannel(channelID, guildID) {
  try {
    const guild = await discord.client.guilds.fetch(guildID)
    const voiceChannel = discord.client.channels.cache.get(channelID)
    const connection = joinVoiceChannel({
      channelId: channelID,
      guildId: guildID,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
  } catch (err) {
    console.error(err)
    throw err
  }
}

// unban
async function unban(guildID, userID) {
  try {
    const guild = await discord.client.guilds.fetch(guildID)
    
    // check si l'id est bon
    const bannis = await guild.bans.fetch(userID).then().catch(console.error);
    
    // unban l'utilisateur
    await guild.bans.remove(userID).then(user => console.log(`Unbanned ${user.username} from ${guild.name}`)).catch(console.error);
    
  } catch (err) {
    console.error(err)
    throw err
  }
}

// Send Message To Channel
async function sendMessage(channelID, msg) {
  try {
    const channel = await discord.client.channels.fetch(channelID)
    await channel.send(msg)
  } catch (err) {
    console.error(err)
    throw err
  }
}

// Kick a User
async function kick(userID, guildID, reason) {
  try {
    const kickableUser = await discord.client.users.fetch(userID)
    const guild = await discord.client.guilds.fetch(guildID)
    const kickableMember = await guild.members.fetch(kickableUser)
    await kickableMember.kick(reason)
  } catch (err) {
    console.error(err)
    throw err
  }
}

// Ban a User
async function ban(userID, guildID, reason) {
  try {
    const bannableUser = await discord.client.users.fetch(userID)
    const guild = await discord.client.guilds.fetch(guildID)
    await guild.members.ban(bannableUser, {
      days: 0,
      reason: reason
    })
  } catch (err) {
    console.error(err)
    throw err
  }
}

// Crée un salon textuel
async function createsalontextuel(guildID, categoryID, channelname){
  try{
    const guild = discord.client.guilds.cache.get(guildID)
    await guild.channels.create({
      name: channelname,
      type: ChannelType.GuildText,
      parent: categoryID,
    });
  } catch (err) {
    console.error(err)
    throw err
  }
}

// Crée un salon vocal 
async function createsalonvocal(guildID, categoryID, channelname){
  try{
    const guild = discord.client.guilds.cache.get(guildID)
    await guild.channels.create({
      name: channelname,
      type: ChannelType.GuildVoice,
      parent: categoryID,
    });
  } catch (err) {
    console.error(err)
    throw err
  }
}
// Supprime un salon textuel / vocal
async function deletesalon(guildID, channelID){
  try{
    const guild = discord.client.guilds.cache.get(guildID)
    guild.channels.delete(channelID)
  } catch (err) {
    console.error(err)
    throw err
  }
}

//ajoute un bracelet a l'utilisateur cible
async function bracelet(guildID, userID, roleID){
  try{
    //trouve le bon server
    const guild = discord.client.guilds.cache.get(guildID)
    //console.log(guild.roles.cache.map(role => ({name : role.name})));
    //console.log(guild.members.cache.map(member => ({member : member.user.username})));
    const role = guild.roles.cache.get(roleID);
    //console.log(role);
    const member = guild.members.cache.get(userID)
    //console.log(member);
    await member.roles.add(role);
  } catch (err) {
    console.error(err)
    throw err
  }
}

//retire un bracelet a l'utilisateur cible
async function nobracelet(guildID, userID, roleID){
  try{
    const guild = discord.client.guilds.cache.get(guildID)
    const role = guild.roles.cache.get(roleID);
    const member = guild.members.cache.get(userID)
    await member.roles.remove(role);
  } catch (err) {
    console.error(err)
    throw err
  }
}

// Diss a User
async function diss(channelID, victim) {
  try {
    // Generate Insult
    const res = await fetch(process.env.INSULT_GEN_URI)
    const data = await res.json()
    
    // Send Insult
    await sendMessage(channelID, `${victim}, ${data.insult}`)
  } catch (err) {
    console.error(err)
    throw err
  }
}

module.exports = {
  kick: kick,
  ban: ban,
  createsalontextuel: createsalontextuel,
  createsalonvocal : createsalonvocal,
  deletesalon : deletesalon,
  bracelet : bracelet,
  nobracelet : nobracelet,
  diss: diss,
  sendMessage: sendMessage,
  diss: diss,
  unban: unban,
  joinchannel: joinchannel,
  leavechannel: leavechannel,
  playsound: playsound,
  playsoundYTB: playsoundYTB,
  stopsound: stopsound,
  getDate: getDate,
  getTime: getTime,
  getHour: getHour,
  hasLetterOrNumber: hasLetterOrNumber,
}