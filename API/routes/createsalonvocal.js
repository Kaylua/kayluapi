const express = require('express')
const router = express.Router()
const functions = require('../../BOT/functions')
const discord = require('../../BOT/discordmain')
const logs = require('../DB_schemas/logs')

router.post('/channel', async (req, res) => {
  try {
    //-- Création de la réponse
    const user = await discord.client.users.fetch(req.body.userID)
    const name = user.username
    const discriminator = user.discriminator
    const time = await functions.getTime()

    var channelName = req.body.channelname
    if(!functions.hasLetterOrNumber(channelName)){
      channelName = "noName"
    }
    //--

    //-- Création du log
    const newlog = new logs();
    newlog.action = "CREATE_SALON_VOCAL";
    newlog.username = name;
    newlog.discriminator = discriminator;
    newlog.guildID = req.body.guildID;
    newlog.time = time;
    newlog.options = {nom_salon: channelName};
    await newlog.save(); // on envois à la bdd
    //--
    
    const response = {action: "CREATE_SALON_VOCAL", username: name, discriminator: discriminator, guildID : req.body.guildID, nom_salon: channelName, time: time}

     await functions.createsalonvocal(req.body.guildID, req.body.categoryID, channelName)
     res.status(200).json( response )
  } catch (err) {
    res.status(500).json(err.message)
    console.error(err)
  }
})


module.exports = router