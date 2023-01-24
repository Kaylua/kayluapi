const express = require('express')
const router = express.Router()
const functions = require('../../../BOT/functions')
const mongoose = require('mongoose')
const lienYTB = require('../../DB_schemas/lienYTB')
const discord = require('../../../BOT/discordmain')
const logs = require('../../DB_schemas/logs')

router.post('', async (req, res) => {
  try {
    //-- Envois la requête à la BDD
    const newlink = new lienYTB();
    newlink.name = req.body.name;
    newlink.lienYTB = req.body.link;
    newlink.tags = req.body.tags;
    newlink.userid = req.body.userID;
    newlink.guildID = req.body.guildID;
    newlink.duration = req.body.duration;
    newlink.level = req.body.level;
    await newlink.save(); // on envois à la bdd
    //--

    //-- Création de la réponse
    const user = await discord.client.users.fetch(req.body.userID)
    const name = user.username
    const discriminator = user.discriminator
    const time = await functions.getTime()
    //--

    //-- Création du log
    const newlog = new logs();
    newlog.action = "ADD_YTB_LINK_DB";
    newlog.username = name;
    newlog.discriminator = discriminator;
    newlog.guildID = req.body.guildID;
    newlog.time = time;
    newlog.options = {link_name: req.body.name, link: req.body.link};
    await newlog.save(); // on envois à la bdd
    //--

    const response = {action: "ADD_YTB_LINK_DB", username: name, discriminator: discriminator, guildID: req.body.guildID, link_name: req.body.name, link: req.body.link, time: time}

    res.status(200).json( response )
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

module.exports = router