const express = require('express')
const router = express.Router()
const functions = require('../../BOT/functions')
const discord = require('../../BOT/discordmain')
const logs = require('../DB_schemas/logs')

router.post('/dellchannel', async (req, res) => {
  try {
    //-- Création de la réponse
    const user = await discord.client.users.fetch(req.body.userID)
    const name = user.username
    const discriminator = user.discriminator
    const channel = await discord.client.channels.fetch(req.body.channelID)
    const time = await functions.getTime()
    //--
    await functions.deletesalon(req.body.guildID, req.body.channelID)

    //-- Création du log
    const newlog = new logs();
    newlog.action = "DELETE_SALON";
    newlog.username = name;
    newlog.discriminator = discriminator;
    newlog.guildID = req.body.guildID;
    newlog.time = time;
    newlog.options = {nom_salon: channel.name};
    await newlog.save(); // on envois à la bdd
    //--
    
    const response = {action: "DELETE_SALON", username: name, discriminator: discriminator, guildID : req.body.guildID, nom_salon: channel.name, time: time}

     res.status(200).json( response )
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})


module.exports = router