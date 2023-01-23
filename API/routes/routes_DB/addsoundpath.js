const express = require('express')
const router = express.Router()
const functions = require('../../../Bot/functions')
const mongoose = require('mongoose')
const soundpath = require('../../DB_schemas/soundpath')
const discord = require('../../../BOT/discordmain')
const logs = require('../../DB_schemas/logs')

router.post('', async (req, res) => {
  try {
    //-- Envois la requête à la BDD
    const newsound = new soundpath();
    newsound.name = req.body.name;
    newsound.soundpath = req.body.path;
    newsound.tags = req.body.tags;
    newsound.userid = req.body.userID;
    newsound.guildID = req.body.guildID;
    newsound.duration = req.body.duration;
    newsound.level = req.body.level;
    await newsound.save(); // on envois à la bdd
    //--

    //-- Création de la réponse
    const user = await discord.client.users.fetch(req.body.userID)
    const name = user.username
    const discriminator = user.discriminator
    const time = await functions.getTime()
    //--

    //-- Création du log
    const newlog = new logs();
    newlog.action = "ADD_SOUND_PATH_DB";
    newlog.username = name;
    newlog.discriminator = discriminator;
    newlog.guildID = req.body.guildID;
    newlog.time = time;
    newlog.options = {sound_name: req.body.name};
    await newlog.save(); // on envois à la bdd
    //--

    const response = {action: "ADD_SOUNDPATH_DB", username: name, discriminator: discriminator, guildID : req.body.guildID, sound_name: req.body.name, time: time}
    
    res.status(200).json( response )
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

module.exports = router