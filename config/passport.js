const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require('mongoose');
const userModel = require('../models/user_models');
const keys = require('./keys');
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keys.privateKey
};
module.exports = (passport) => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) =>{
        userModel.findById(jwt_payload.id)
        .then(user => {
            if(user) return done(null, user);
            return done(null, false);
        })
        .catch((error) => console.log(error.message));
    }));
};