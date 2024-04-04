'use strict';

const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueFilename = uuidv4() + '_' + file.originalname;
        cb(null, uniqueFilename);
    }
});
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Upload file to file.io service
        const data = await uploadFileToService(req.file);
        if (data.success) {
            const fileLink = data.link;
            res.send(fileLink);
        } else {
            res.status(500).send('Error uploading file: ' + data.message);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Error uploading file. Please try again later.');
    }
});

// Function to upload file to file.io service
async function uploadFileToService(file) {
    const formData = new FormData();
    formData.append('file', file.buffer, { filename: file.originalname });

    const response = await fetch('http://file.io/?expires=1d', {
        method: 'POST',
        body: formData
    });

    return await response.json();
}

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
