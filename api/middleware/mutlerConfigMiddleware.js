const multer = require('multer');

const storage = multer.diskStorage({
  destination: '../uploads/', // Destination directory for uploaded files
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.name); // File name generation
  },
});

const upload = multer({ storage: storage });
