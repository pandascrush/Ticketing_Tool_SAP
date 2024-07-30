// Import required modules
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the storage location and filename handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define the upload directory
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using the field name, timestamp, and random number
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Initialize the multer middleware
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Define allowed file types
        const allowedTypes = /jpeg|jpg|png|gif|pdf/;
        // Check if the file extension is allowed
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        // Check if the MIME type is allowed
        const mimeType = allowedTypes.test(file.mimetype);

        // Allow file if both extension and MIME type are valid
        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed.'));
        }
    }
});

export default upload;
