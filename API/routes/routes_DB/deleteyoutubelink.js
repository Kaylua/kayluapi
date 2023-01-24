const express = require('express')
const router = express.Router()
const functions = require('../../../BOT/functions')
const mongoose = require('mongoose')
const lienYTB = require('../../DB_schemas/lienYTB')
const discord = require('../../../BOT/discordmain')
const logs = require('../../DB_schemas/logs')

router.post('', async (req, res) => {
  try {
    //-- Création de la réponse
    const user = await discord.client.users.fetch(req.body.userID)
    const name = user.username
    const discriminator = user.discriminator
    const time = await functions.getTime()
    const infos  = await lienYTB.findOne({ _id: req.body.id }, 'name lienYTB'); // returns {deletedCount: 1}
    //--

    await lienYTB.deleteOne({ _id: req.body.id }); // returns {deletedCount: 1}

    //-- Création du log
    const newlog = new logs();
    newlog.action = "DELETE_YTB_LINK_DB";
    newlog.username = name;
    newlog.discriminator = discriminator;
    newlog.guildID = req.body.guildID;
    newlog.time = time;
    newlog.options = {link_name: infos.name, link: infos.lienYTB};
    await newlog.save(); // on envois à la bdd
    //--

    const response = {action: "DELETE_YTB_LINK_DB", username: name, discriminator: discriminator, guildID : req.body.guildID, link_name: infos.name, link: infos.lienYTB, time: time}
    
    res.status(200).json( response )
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

module.exports = router