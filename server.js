const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();
const Utils = require("./utils/init_data");

// create express app
const app = express();

var corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));

// Configuring the database
const mongoose = require('mongoose');
mongoose.set('runValidators', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({ "message": "Welcome demo apis" });
});

// routes
require('./src/User/route')(app);

// listen for requests
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
app.listen(port, host, () => {
    console.log(`Server is running on port ${port}. ${host}`)
});

Utils.initData();