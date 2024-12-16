import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Configure storage
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); // Destination folder
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop(); // Extract file extension
        cb(null, `${uuidv4()}.${ext}`); // Generate unique filename
    }
});

// Set up multer with storage and additional constraints
var upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // Allowed file types
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpeg, .png, and .gif formats are allowed!'), false);
        }
    }
});

export default upload;
