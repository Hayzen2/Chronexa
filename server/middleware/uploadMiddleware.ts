import multer from 'multer';

// Store files in memory for now, can be changed to disk storage if needed
const storage = multer.memoryStorage(); 
const uploadAvatar = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        // Accept the images only
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); // cb (error, acceptFile) => accept
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }   
    }
});

const uploadFile = multer({ 
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // Limit file size to 20MB
    fileFilter: (req, file, cb) => {
        // Accept the images, PDFs, excel, txt, word, ppt files only
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf'
    || file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    || file.mimetype === 'text/plain'
    || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
            cb(null, true); // cb (error, acceptFile) => accept
        }
        else {
            cb(new Error('Only image, PDF, Excel, TXT, Word, and PowerPoint files are allowed!'));
        }   
    }
});

export { uploadAvatar, uploadFile };