require('dotenv').config()
const express   = require('express')
const mongoose  = require('mongoose')
const bcrypt    = require('bcrypt')
const jwt       = require('jsonwebtoken')

const app = express()

//Public routex
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem vindo a nossa api' })
})

mongoose.connect().then(() => {
  app.listen(3000)
  console.log('Conectou ao banco')
}).catch((err) => console.log('erro: ', err))
