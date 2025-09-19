//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const app = express();

// config JSON response

app.use(express.json())

// rota publica
app.get('/', (req, res) => {
    res.status(200).json({msg: 'Bem vindo a API'});
});

//register user
app.post('/auth/register', async (req, res) => {
    const {name, email, password, confirmpassword} = req.body;


    //validations
    if(!name || name === null || name === undefined){
        return res.status(422).json({msg: 'O nome é obrigatório!'})
    }
    if(!email || email === null || email === undefined) {
        return res.status(422).json({msg: 'O email é obrigatório!'})
    }
    if(!password || password === null || password === undefined) {
        return res.status(422).json({msg: 'A senha é obrigatória!'})
    }
    if(password !== confirmpassword){
        return res.status(422).json({msg: 'As senhas não conferem!'})
    }
})

// credenciais

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;


mongoose   
    .connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.vb9dsk0.mongodb.net/`)
    .then(() => {
        app.listen(3000)
        console.log('Conectou ao MongoDB')
    })
    .catch((err) => console.log(err))

