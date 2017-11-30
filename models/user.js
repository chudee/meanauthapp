const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const config = require('../config')

const UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = module.exports = mongoose.model('User', UserSchema)

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback)
}

module.exports.getUserByUsername = async (username) => {
    const query = {username: username}
    try {
        return User.findOne(query)
    } catch(e) {
        throw Error(e)
    }
}

module.exports.addUser = async (newUser) => {
    try {
        let hash = bcrypt.genSalt(10).then((salt) => {
            return bcrypt.hash(newUser.password, salt)
                .then((hash) => hash)
            })
        newUser.password = await hash
        let saveUser = await newUser.save()

        return saveUser
    } catch(e) {
        throw Error(e)
    }
}

module.exports.comparePassword = async (candidatePassword, hash) => {
    try {
        return bcrypt.compare(candidatePassword, hash)
            .then((isMatch) => (null, isMatch))
    } catch(e) {
        throw Error(e)
    }
}