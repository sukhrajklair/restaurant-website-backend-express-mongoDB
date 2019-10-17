const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const authenticate = require('../authenticate');
const uploadRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req, file, cb)=>{
    //using regexp to check if the uploaded file is an image file
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can only uplaod image fiels!'), false);
    }
    cb(null,true);
}

const upload = multer({storage: storage, fileFilter: imageFileFilter});

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, 
    //this function takes the name of the upload form field as its argument
    upload.single('image'),
    (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','application/json');
    //send the req.file object back in response to be used to included reference
    //to the file in the new JSON document being created that uses the image
    res.json(req.file);
    }
)
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
})

module.exports = uploadRouter;