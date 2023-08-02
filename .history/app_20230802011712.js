require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

//config json response
app.use(express.json())
//models
const User = require('./models/User')
const { decrypt } = require('dotenv')

//Public routex
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Bem vindo a nossa api' })
})

//private route
app.get('/user/:id', checkToken, async(req, res) => {
  const id = req.params.id

  //check user exists
  const user = await User.findById(id, '-password')

  if(!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado' })
  }
  res.status(200).json({ user })
})

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(!token) {
    return res.status(401).json({ msg: 'Acesso negado!' })
  }
}

//Register user
app.post('/auth/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body

  if (!name) {
    return res.status(422).json({ msg: 'O nome é obrigatório' })
  }
  if (!email) {
    return res.status(422).json({ msg: 'O email é obrigatório' })
  }
  if (!password) {
    return res.status(422).json({ msg: 'A senha é obrigatório' })
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ msg: 'As senhas não conferem' })
  }

  //check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.status(422).json({ msg: 'E-mail já utilizado' })
  }

  //create password
  const salt = await bcrypt.genSalt(12)
  const passwordHash = await bcrypt.hash(password, salt)

  //create user
  const user = new User({
    name,
    email,
    password: passwordHash,
  })
  try {
    await user.save()
    res.json({ masg: 'Usuário criado com sucesso!' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'error' })
  }
})

//login user
app.post('/auth/login', async (req, res) => {

  const { email, password } = req.body;

  //validations login
  if (!email) {
    return res.status(422).json({ msg: 'O email é obrigatório' })
  }
  if (!password) {
    return res.status(422).json({ msg: 'A senha é obrigatório' })
  }

  //check user exist
  const user = await User.findOne({ email })
  
  if(!user) {
    return res.status(422).json({ msg: 'Usuário não encontrado' })
  }

  //check if password match
  const checkPassword = await bcrypt.compare(password, user.password)
  if(!checkPassword) {
    return res.status(404).json({ msg: 'Senha inválida' })
  }

  try {
    const secret = process.env.SECRET
    const token = jwt.sign({
      id: user._id,
    }, secret)
    res.status(200).json({ msg: 'Autenticação realizada com sucesso!', token })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'error' })
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

