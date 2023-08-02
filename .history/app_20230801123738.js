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

//Register user
app.post('/auth/register', async(req, res) => {
  const {name, email, password, confirmPassword} = req.body
  
  if(!name) {
    return res.status(422).json({ msg: 'O nome é obrigatório' })
  }
})

//Credencials
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPass}@cluster0.g8wpxkx.mongodb.net/?retryWrites=true&w=majority`
).then(() => {
  app.listen(3000)
  console.log('Conectou ao banco')
}).catch((err) => console.log('erro: ', err))

