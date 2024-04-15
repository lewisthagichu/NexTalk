const multer = require('multer');
const path = require('path');

// Custom Multer storage engine
const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    if (!ext) {
      return cb(new Error('Error: File extension not found'), null);
    }
    cb(null, filename);
  },
});

// Multer configuration using custom storage engine
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// Check Files
function checkFileType(file, cb) {
  // Define accepted file types
  const acceptedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];

  // Extract file extension and convert to lowercase
  const extName = path.extname(file.originalname).toLowerCase();

  // Check if both extension and mimetype are valid
  const isValidExtension = acceptedFileTypes.includes(extName.slice(1)); // slice(1) removes the leading dot
  const isValidMimeType = acceptedFileTypes.includes(
    file.mimetype.split('/')[1]
  );

  if (isValidExtension && isValidMimeType) {
    cb(null, true); // Pass validation
  } else {
    cb(new Error('Error: File format not supported'), false); // Fail validation
  }
}

module.exports = upload;
