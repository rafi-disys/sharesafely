const express = require('express'); // for 
const multer = require('multer'); //middleware package that handles file uploads
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

// Set up database configuration
const dbConfig = {
    user: 'your-username',
    password: 'your-password',
    server: 'your-server.database.windows.net',
    database: 'your-database',
    options: {
        encrypt: true // Enable encryption for Azure SQL
    }
};

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up server routes
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Access the uploaded file using req.file
        const uploadedFile = req.file;
        
        if (uploadedFile) {
            // Log the buffer content to the console
            console.log(uploadedFile.buffer.toString('utf-8'));

            // Your other processing logic here...

            res.status(200).send('File uploaded and data saved.');
        } else {
            res.status(400).send('No file uploaded.');
        }
        // Connect to the database
        const pool = await sql.connect(dbConfig);

        // Insert data into the database
        const query = `
            INSERT INTO UploadedFiles (OriginalFilename, UploadTimestamp)
            VALUES (@originalFilename, @uploadTimestamp);
        `;
        await pool.request()
            .input('originalFilename', sql.NVarChar, uploadedFile.originalname)
            .input('uploadTimestamp', sql.DateTime, new Date())
            .query(query);

        res.status(200).send('File uploaded and data saved.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
