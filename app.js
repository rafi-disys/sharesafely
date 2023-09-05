const express = require("express");
const path = require("path");
const { v1: uuidv1 } = require("uuid");
const multer = require("multer"); // Middleware package that handles file uploads
const { BlobServiceClient } = require("@azure/storage-blob");

const app = express();
const port = process.env.PORT || 3000;

// Set up storage configuration for Azure Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(
  "DefaultEndpointsProtocol=https;AccountName=sharesafely;AccountKey=6Ak/J8LXJJfboiEUuxpxPu88r//CK7WBvb8LDu8FFqme+Xnr7LIsSZg6K4lmO4J20jBbX3OddO8/+AStoeMkxw==;EndpointSuffix=core.windows.net"
);
const containerName = "filecontainer";
const containerClient = blobServiceClient.getContainerClient(containerName);

// Serve static assets from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up server routes
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Access the uploaded file using req.file
    const uploadedFile = req.file;

    if (uploadedFile) {
      // Get a reference to a blob
      const blobName = uploadedFile.originalname;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload the file buffer to Azure Blob Storage
      const buffer = uploadedFile.buffer;
      await blockBlobClient.uploadData(buffer, buffer.length);

      res.status(200).send("File uploaded to Azure Blob Storage.");
    } else {
      res.status(400).send("No file uploaded.");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred.");
  }
});

module.exports = app;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


