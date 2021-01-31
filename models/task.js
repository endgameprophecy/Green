const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const TaskSchema = new Schema({
    address:{
        type: String,
        unique: true,
    },
    latitude:{
        type: Number,
        required: true
    },
    longitude:{
        type: Number,
        required: true
    },
    description:{
        type: String
    },
    date:{
        type: String,
        default: Date.now
    },
    status:{
        type: String,
        default: "Not Claimed"
    },
    value: {
        type: Number,
        default: 0
    },
    postedBy:{
        type: String
    },
    postedName:{
        type: String
    },
    postedSecret:{
        type:String
    },
    claimedBy:{
        type: String
    },
    claimedName:{
        type: String
    },
    claimedPublic:{
        type:String
    }
});

module.exports = Task = mongoose.model('task', TaskSchema);