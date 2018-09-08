const express = require('express');
const router = express.Router()
const userModel = require('../models/user_models');
const bcrypt = require('bcryptjs');


router.get('/', (req, res) =>{
    res.send('Hello World');
})
router.get('/:id', (req, res)=>{

});
router.post('/add/', (req, res) => {
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
module.exports = router;