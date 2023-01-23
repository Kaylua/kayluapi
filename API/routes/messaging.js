const express = require('express')
const router = express.Router()
const functions = require('../../BOT/functions')
const discord = require('../../BOT/discordmain')
const logs = require('../DB_schemas/logs')

router.post('/message/:channelID', async (req, res) => {
  try {
    //-- Création de la réponse
    const user = await discord.client.users.fetch(req.body.userID)
    const name = user.username
    const discriminator = user.discriminator
    const channel = await discord.client.channels.fetch(req.params.channelID)
    const channelname = channel.name
    const message = req.body.message
    const time = await functions.getTime()
    //--

    const response = {action: "MESSAGING", username: name, discriminator: discriminator, guildID : req.body.guildID, message: message, channel: channelname, time: time}

    const channelID = req.params.channelID
    await functions.sendMessage(channelID, req.body.message)

    //-- Création du log
    const newlog = new logs();
    newlog.action = "MESSAGING";
    newlog.username = name;
    newlog.discriminator = discriminator;
    newlog.guildID = req.body.guildID;
    newlog.time = time;
    newlog.options = {message: message, channel: channelname};
    await newlog.save(); // on envois à la bdd
    //--
    
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json(err.message)
    console.error(err)
  }
})

router.post('/diss/:channelID', async (req, res) => {
  try {
    const channelID = req.params.channelID
    await functions.diss(channelID, req.body.victim_name)

    res.status(200).json({ message: 'Message Posted' })
  } catch (err) {z
    res.status(500).json(err.message)
    console.log(err)
  }
})

module.exports = router