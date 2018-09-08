const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const db = require('../config/keys').mongoURI;

const courseRoute = require('../routes/courses');
const homeRoute = require('../routes/home');
app.use('/courses', courseRoute);
app.use('/', homeRoute);

mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log("Successfully connected to MongoDB!"))
.catch((error) => console.log(error.message));

const port = process.env.PORT || 8000;
app.listen(port, () => {console.log("Server is listening to port: " + port)});