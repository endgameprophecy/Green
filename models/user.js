
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    bio: {
        type: String
    },
    userType:{
        type: String,
        required: true,
    },
    balance:{
        type: Number,
    },
    publicKey: {
        type: String,
    },
    secretKey: {
        type: String
    }
});

module.exports = User = mongoose.model('user', UserSchema);