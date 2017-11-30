const express = require('express')
const path = require('path')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const bluebird = require('bluebird')
const config = require('./config')
const passport = require('passport')

const app = express()

const users = require('./routes/users');

const port = 3000

// MongoDb Setting & Connection
mongoose.Promise = bluebird
mongoose.connect(config.database, {useMongoClient: true})
    .then(() => {console.log('Succesfully Connected to the Mongodb Database')})
    .catch(() => {console.log('Error Connecting to the Mongodb Database')})

// Middleware setting
app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// Set Static Foler
app.use(express.static(path.join(__dirname, 'public')))

// Routes setting
app.use('/users', users)

// Index router
app.get('/', (req, res) => {
    res.send('express')
})

// Server start
app.listen(port, () => {
    console.log('express server is running: ' + port)
})