
const express = require('express');
const multer = require('multer');
const router = express.Router();

var Image = require('../models/image');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/Users/winston/Documents/Programming/WebDevelopment/CryptoGreen/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        // rejects storing a file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

/* 
    stores image in uploads folder
    using multer and creates a reference to the 
    file
*/
router.route("/")
    .post(upload.single('imageData'), (req, res, next) => {
        console.log(req.body);
        let newImage
        if (req.body.type === "Profile"){
            newImage = new Image({
                type: req.body.type,
                address: "",
                userId: req.body.userId,
                image: req.file.path
            });
        }else{
            newImage = new Image({
                type: req.body.type,
                address: req.body.address,
                userId: req.body.userId,
                image: req.file.path
            });   
        }
        newImage.save()
            .then((result) => {
                console.log(result);
                res.status(200).json({
                    success: true,
                    document: result
                });
            })
            .catch((err) => next(err));
});

router.get('/:userId', (req, res) => {    
    console.log(req.query);
    const { type, address } = req.query;
    if (type == "Profile"){
        Image.find({ userId: req.params.userId, type: type }, (err, items) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(items);
                return res.json(items[items.length - 1]);
            }
        });
    }else{
        Image.find({ type: type, address: address }, (err, items) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("mark",items);
                return res.json(items);
            }
        });
    }
});

module.exports = router;
