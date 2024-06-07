const path = require('path');
const fs = require('fs').promises;

// Allowed file types and maximum file size
const allowedFileTypes = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.mp4',
  '.mov',
  '.avi',
  '.pdf',
  '.mp3',
  '.wav',
  '.doc',
  '.docx',
];
const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'application/pdf',
  'audio/mpeg',
  'audio/wav',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const maxFileSize = 2 * 1024 * 1024; // 2 MB

const saveToFS = async (fileName, fileType, fileBuffer) => {
  try {
    // const buffer = Buffer.from(fileBuffer);
    const fileSize = fileBuffer.length;
    const fileExt = `.${fileName.split('.').pop().toLowerCase()}`;

    // // Validate file size
    if (fileSize > maxFileSize) {
      throw new Error('File size exceeds the 2MB limit');
    }

    // Validate file extension
    if (!allowedFileTypes.includes(fileExt)) {
      throw new Error('File extension not supported');
    }

    // Validate MIME type
    if (!allowedMimeTypes.includes(fileType)) {
      throw new Error('MIME type not supported');
    }

    const pathName = path.join(__dirname, '..', 'uploads/', fileName);
    const bufferData = Buffer.from(fileBuffer.split(',')[1], 'base64');
    await fs.writeFile(pathName, bufferData);

    console.log('file saved:' + pathName);
  } catch (error) {
    console.error('Error saving file:', error.message);
    throw error;
  }
};

module.exports = { saveToFS };
