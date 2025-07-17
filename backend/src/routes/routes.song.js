const express = require('express');
const router = express.Router();
const songModel = require('../models/songs.model');
const multer = require('multer');
const uploadFile = require('../services/storage.service')

// using multer to view file as binary data
// multer is used for handling multipart/form-data, which is primarily used for uploading files
const upload = multer({
    storage:multer.memoryStorage(),
})

router.post('/songs',upload.single('audio'), async (req, res) => {

    const imageKitRes = await uploadFile(req.file)
    console.log("Received song data:", req.body);
    res.send("Song data received");
    console.log(req.file)
    console.log(imageKitRes)
});

module.exports = router;