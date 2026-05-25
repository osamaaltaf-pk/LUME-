import multer from 'multer';
import path from 'path';
import os from 'os';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // On Vercel (production), only /tmp is writable
    if (process.env.NODE_ENV === 'production') {
      cb(null, os.tmpdir());
    } else {
      cb(null, 'uploads/'); // Create this folder in your backend root
    }
  },
  filename: (req, file, cb) => {

    // Create unique filename
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,// 5MB limit
    files: 5
  }
});

export default upload;