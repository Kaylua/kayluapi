const express = require('express');
const router = express.Router();
const functions = require('../../BOT/functions');
const discord = require('../../BOT/discordmain');

router.get('', async (req, res) => {
  try {
    const guild = await discord.client.guilds.fetch(req.query.guildID);
    const roles = guild.roles.cache;
    
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})


module.exports = router;