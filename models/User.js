import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 24
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    roles: {
        type: String,
        required: true,
        default: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.models.User || mongoose.model('User', userSchema)