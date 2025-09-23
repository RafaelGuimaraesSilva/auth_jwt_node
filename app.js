//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const cors = require('cors');
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



// config JSON response
app.use(express.json());

// models
const User = require('./models/User.js');

// rota publica
app.get('/', (req, res) => {
    res.status(200).json({msg: 'Bem vindo a API'})
})

//private route
app.get('/user/:id', checkToken,  async (req, res) => {
    const id = req.params.id  

    //check if user exists
    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }
    
    // ✅ ADICIONE ESTA LINHA - retorna o usuário
    res.status(200).json({ user })
})

//private route middleware
function checkToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({ msg: 'Acesso negado!' })
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch(error) {
        res.status(400).json({ msg: 'Token inválido!' })
    }
}

//register user
app.post('/auth/register', async (req, res) => {
    const {name, email, password, confirmpassword} = req.body;

    //validations
    if(!name){
        return res.status(422).json({msg: 'O nome é obrigatório!'})
    }
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
    if(!password){
        return res.status(422).json({msg: 'A senha é obrigatória!'})
    }
    if(password !== confirmpassword){
        return res.status(422).json({msg: 'As senhas não conferem!'})
    }

    //check if user exists
    const userExists = await User.findOne({email: email})
    if(userExists){
        return res.status(422).json({msg: 'Email já cadastrado, por favor utilize outro!'})
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
        res.status(201).json({msg: 'Usuário criado com sucesso!'})

    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'})
    }
})

//login user
app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;

    //validations
    if(!email){
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
     if(!password){
        return res.status(422).json({msg: 'A senha é obrigatório!'})
    }

    //check if user exists
    const user  = await User.findOne({email: email})
    if(!user){
        return res.status(404).json({msg: 'Usuário não encontrado!'})
    }

    //check if password matches
    const checkPassword = await bcrypt.compare(password, user.password) 

    if(!checkPassword){
        return res.status(422).json({msg: 'Senha inválida!'})
    }

    try {
        const secret = process.env.SECRET
        //create token
        const token = jwt.sign(
            {
                id: user._id,
            },
            secret,
        )
        res.status(200).json({msg: 'Autenticação realizada com sucesso!', token})
    } catch(error) {
        res.status(500).json({ msg: error })
    }
})

// credenciais
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vb9dsk0.mongodb.net/`)
    .then(() => {
        app.listen(3000)
        console.log('Conectou ao MongoDB')
    })
    .catch((err) => console.log(err))