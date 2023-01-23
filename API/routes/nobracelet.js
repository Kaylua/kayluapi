const express = require('express')
const router = express.Router()
const functions = require('../../BOT/functions')
const discord = require('../../BOT/discordmain')
const logs = require('../DB_schemas/logs')

router.post('/norole', async (req, res) => {
  try {
    //-- Création de la réponse
    const user = await discord.client.users.fetch(req.body.userID)
    const user2 = await discord.client.users.fetch(req.body.usernobraceletID)
    const name = user.username
    const name2 = user2.username
    const discriminator2 = user2.discriminator
    const discriminator = user.discriminator
    const time = await functions.getTime()
    //--
    await functions.nobracelet(req.body.guildID, req.body.usernobraceletID, req.body.roleID)

    //-- Création du log
    const newlog = new logs();
    newlog.action = "NO_BRACELET";
    newlog.username = name;
    newlog.discriminator = discriminator;
    newlog.guildID = req.body.guildID;
    newlog.time = time;
    newlog.options = {username2: name2, discriminator2: discriminator2};
    await newlog.save(); // on envois à la bdd
    //--
    const response = {action: "NO_BRACELET", username: name, discriminator: discriminator, guildID : req.body.guildID, username2: name2, discriminator2: discriminator2, time: time}
    
     res.status(200).json( response )
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})


module.exports = router