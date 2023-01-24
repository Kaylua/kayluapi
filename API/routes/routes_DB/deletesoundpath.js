const express = require('express')
const router = express.Router()
const functions = require('../../../BOT/functions')
const mongoose = require('mongoose')
const soundpath = require('../../DB_schemas/soundpath')
const discord = require('../../../BOT/discordmain')
const logs = require('../../DB_schemas/logs')

router.post('', async (req, res) => {
  try {
    //-- Création de la réponse
    const user = await discord.client.users.fetch(req.body.userID)
    const name = user.username
    const discriminator = user.discriminator
    const time = await functions.getTime()
    const infos  = await soundpath.findOne({ _id: req.body.id }, 'name'); // returns {deletedCount: 1}
    //--

    await soundpath.deleteOne({ _id: req.body.id }); // returns {deletedCount: 1}

    //-- Création du log
    const newlog = new logs();
    newlog.action = "DELETE_SOUND_PATH_DB";
    newlog.username = name;
    newlog.discriminator = discriminator;
    newlog.guildID = req.body.guildID;
    newlog.time = time;
    newlog.options = {sound_name: infos.name};
    await newlog.save(); // on envois à la bdd
    //--

    const response = {action: "DELETE_SOUND_PATH_DB", username: name, discriminator: discriminator, guildID : req.body.guildID, sound_name: infos.name, time: time}
    
    res.status(200).json( response )
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

module.exports = router