const express = require('express')
const router = express.Router()
const functions = require('../../BOT/functions')
const discord = require('../../BOT/discordmain')
const logs = require('../DB_schemas/logs')

router.post('', async (req, res) => {
  try {
    //-- Création de la réponse
    const user = await discord.client.users.fetch(req.body.userID)
    const name = user.username
    const discriminator = user.discriminator
    const time = await functions.getTime()
    //--
    await functions.playsoundYTB(req.body.guildID, req.body.lienYTB)

    //-- Création du log
    const newlog = new logs();
    newlog.action = "PLAY_SOUND_YTB";
    newlog.username = name;
    newlog.discriminator = discriminator;
    newlog.guildID = req.body.guildID;
    newlog.time = time;
    newlog.options = {link: req.body.lienYTB};
    await newlog.save(); // on envois à la bdd
    //--

    const response = {action: "PLAY_SOUND_YTB", username: name, discriminator: discriminator, guildID : req.body.guildID, link: req.body.lienYTB, time: time}
    
    res.status(200).json( response )
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

module.exports = router