const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const config = require('../config')

const User = require('../models/user')

// Register
router.post('/register', (req, res, next) => {
    const { name, email, username, password } = req.body
    let newUser = new User({
        name: name,
        email: email,
        username: username,
        password: password
    })

    User.addUser(newUser)
        .then((user) => {
            res.status(200).json({ success: true, msg: 'User registered' })
        })
        .catch((err) => {
            res.status(401).json({ success: false, msg: 'Failed to register user' })
        })
})

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const { username, password } = req.body;

    User.getUserByUsername(username)
        .then((user) => {
            User.comparePassword(password, user.password)
                .then((isMatch) => {
                    const token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: 604800 // 1 week
                    })

                    res.status(200).json({
                        success: true,
                        token: 'JWT ' + token,
                        user: {
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            email: user.email
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).json({ success: false, msg: 'Wrong password' })
                })

            // res.status(200).json({ success: true, msg: 'User registered' })
        })
        .catch((err) => {
            res.status(400).json({ success: false, msg: 'User not found' })
        })
})

// Profile
router.get('/profile', (req, res, next) => {
    res.send('profile')
})

module.exports = router