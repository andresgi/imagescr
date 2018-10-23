var express = require('express');
const bodyParser = require('body-parser')
const quote = require('./routes/quote.route'); // Imports routes for the quotes
const quoteJobs = require('./jobs/quote.jobs'); // Imports routes for the quotes
var app = express();

var DomParser = require('dom-parser');

var dotenv = require('dotenv').config();
const fs = require('fs');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//routes uses
app.use('/quotes', quote);

let dev_db_url = process.env.DB_URL;
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', function (req, res) {
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});