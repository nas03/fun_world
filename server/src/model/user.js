const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: true, unique: true },
    score: {type: Number, default: 0},
    money: {type: Number, default: 0},
    date_created: Date,
    date_updated: Date
})

const User = mongoose.model('User', UserSchema, 'users')
exports.schema = User

exports.create = async function (data) {
    try {
        const userData = {
            name: data.name,
            date_created: new Date(),
            date_updated: new Date()
        }
        const newUser = User(userData)
        await newUser.save()
        return newUser
    } catch (e) {
        return { error: e }
    }
}

exports.get = async function (data) {
    try {
        let query = {}
        if (data.id) query._id = data.id
        if (data.name) query.name = data.name
        const user = await User.findOne(query).lean()
        return user
    } catch (e) {
        return { error: e }
    }
}

exports.getAll = async function () {
    try {
        const users = await User.find({});
        return users;
    } catch (e) {
        return { error: e };
    }
};

exports.update = async function (userId, data) {
    try {
        const result = await User.findByIdAndUpdate(userId, data)
        return await User.findById(result._id)
    } catch (e) {
        return { error: e }
    }
}