var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
	type: {
        type: String,
        required: true
    },
    address:{
        type: String,
    },
    userId: {
        type: String,
        required: true
    },
	image: {
        type: String,
        required: true
	}
});


module.exports = Image = mongoose.model('image', ImageSchema);
