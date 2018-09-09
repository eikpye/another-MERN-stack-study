const express = require('express');
const router = express.Router()
const userModel = require('../models/user_models');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const keys = require('../config/keys');

const passport = require('passport');

const validateRegisterInput = require('../validation/register');

router.get('/', (req, res) =>{
    res.send('Hello World');
});

router.post('/register', (req, res) => {
    const errors = validateRegisterInput(req.body);
    if(errors) return res.status(400).json(errors);
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    let verificationPassed = false;
    const usernameExists = userModel.findOne({name: username})
    .then((usernameExists) => {
        if(usernameExists){
           return res.send('Username have been taken.');
        }
        else{
            const emailExists = userModel.findOne({email: email})
            .then((emailExists) => {
                if(emailExists){
                    return res.send('Email have been taken.');
                }
                else{
                    const newUser = new userModel({
                        name: username,
                        email: email,
                        password: password
                    });
                    bcrypt.genSalt(10)
                    .then((salt) => bcrypt.hash(newUser.password, salt))
                    .then((hash) => {
                        newUser.password = hash;
                        newUser.save()
                        .then((user) => res.json(user))
                    })
                    .catch((error) => res.send(error.message));
                }
            })
        }
    });
    
})
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    userModel.findOne({email: email})
    .then(user => {
        if(!user) return res.send('Invalid email or password (DEBUG_1)');
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(isMatch){
                const jsonwebtokenPayload = {id: user.id};
                jsonwebtoken.sign(jsonwebtokenPayload, keys.privateKey, (error, token) =>{
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                })
                //return res.send(user);
            }
            else{
                return res.send('Invalid email or password (DEBUG_2)')
            }
        })
    })
})
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res)=> {
    res.json(req.user);
})

async function EncryptUserPassword(password){
    try{
        const salt = await bcrypt.genSalt(10);
    }
    catch(error){
        res.send(error.message);
    }
    try{
        return await bcrypt.hash(password, salt);
    }
    catch(error){
        res.send(error.message);
    }
}
module.exports = router;