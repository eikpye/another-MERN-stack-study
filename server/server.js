const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const passport = require('passport');
app.use(passport.initialize());
require('../config/passport')(passport);

const db = require('../config/keys').mongoURI;

const userRoute = require('../routes/user');
const homeRoute = require('../routes/home');
app.use('/user', userRoute);
app.use('/', homeRoute);

mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log("Successfully connected to MongoDB!"))
.catch((error) => console.log(error.message));

const port = process.env.PORT || 8000;
app.listen(port, () => {console.log("Server is listening to port: " + port)});