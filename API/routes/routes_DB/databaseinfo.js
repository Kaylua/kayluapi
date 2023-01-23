const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const lienYTB = require('../../DB_schemas/lienYTB')
const soundpath = require('../../DB_schemas/soundpath')
const logs = require('../../DB_schemas/logs')

// Envois la collection entiere
router.get('/:collection', async (req, res) => {
  try {
    const model = req.params.collection;
    let infos = "";
    if(model == 'youtubelinks'){
      infos = await lienYTB.find({}, { __v: 0 })
    }else if(model == 'soundpaths'){
      infos = await soundpath.find({}, {  __v: 0 })
    }else if(model == 'logs'){
      infos = await logs.find({}, { __v: 0 })
    }else if(model == 'logs_simplified'){
      infos = await logs.find({}, { _id: 0, "username" : true, "action" : true })
    }
    else{
      infos = "Modèle introuvable"
    }    
    res.status(200).json({ logs: infos })
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

// Recherche unique par ID dans une collection
router.get('/logs/:id', async (req, res) => {
  try {
    const id = req.params.id;

    let infos = await logs.find({ guildID: id }, { __v: 0 });

    res.status(200).json({ logs: infos })
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

// Recherche unique par ID dans une collection
router.get('/soundpaths/:id', async (req, res) => {
  try {
    const id = req.params.id;

    let infos = await soundpath.find({ guildID: id }, { __v: 0 });

    res.status(200).json({ logs: infos })
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

// Recherche unique par ID dans une collection
router.get('/youtubelinks/:id', async (req, res) => {
  try {
    const id = req.params.id;

    let infos = await lienYTB.find({ guildID: id }, { __v: 0 });

    res.status(200).json({ logs: infos })
  } catch (err) {
    res.status(500).json(err.message)
    console.log(err)
  }
})

module.exports = router