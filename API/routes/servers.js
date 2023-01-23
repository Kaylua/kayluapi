const express = require('express')
const router = express.Router()
const discordinfo = require('../../BOT/discordmain')

// Get all servers {ID ane Name}
router.get('', (req, res) => {
  try {
    const guilds = discordinfo.client.guilds.cache.map(guild => ({id: guild.id, name: guild.name, channel: guild.channels}))
    res.status(200).json(guilds)
  } catch (err) {
    res.status(404).json(err.message)
  }
})

// Get specific metadata from server with ID
router.get('/:guildID', async (req, res) => {
  try {
    const guildID = req.params.guildID
    const guild = await discordinfo.client.guilds.fetch(guildID)

    // Get Members
    const members = await guild.members.cache.map(member => ({id: member.id, idtype: "memberID", name: member.displayName}))

    // Get Channels
    const channels = await guild.channels.cache.map(channel => ({id: channel.id, idtype: "channelID", name: channel.name, channeltype: channel.type, parentID: channel.parentId}))
    //const channelsModified = channels.filter(channel => channel.channeltype)
    // const channelsModified = channels.filter(channel => channel.channeltype === "text")

    const roles = await guild.roles.cache.map(role => ({name:role.name, id: role.id, color:role.hexColor, hoist: role.hoist, tags: role.tags}))
    //const roletest = await guild.roles.cache.map(role => console.log(role.name));
    console.log(roles);

    
    // Create Response
    const response = {members: members, channels: channels, roles: roles}

    res.status(200).json(response)
  } catch (err) {
    res.status(404).json(err.message)
  }
})

// Recupere les membres ayant un role spécifique
router.get('/:guildID/:roleID', async (req, res) => {
  try {
    const guildID = req.params.guildID
    const guild = await discordinfo.client.guilds.fetch(guildID)

    let roleID = req.params.roleID;
    let membersWithRole = guild.roles.cache.get(roleID).members

    // Create Response
    const response = {roles: membersWithRole}

    res.status(200).json(response)
  } catch (err) {
    res.status(404).json(err.message)
  }
})

module.exports = router