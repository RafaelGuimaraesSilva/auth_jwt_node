//imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: z } = require('zod');

const app = express();

// config JSON response

app.use(express.json())

// rota publica
app.get('/', (req, res) => {
    res.status(200).json({msg: 'Bem vindo a API'});
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
    name: z.string().min(2).max(100).optional(),
    confirmpassword: z.string().min(6).optional()
})

//register user
app.post('/auth/register', async (req, res) => {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.errors.map((err) => err.message);
        return res.status(422).json({msg: errors.join(', ')});
    }

    const {name, email, password, confirmpassword} = result.data;
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
    .catch((err) => console.log(err));

