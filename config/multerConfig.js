const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, 'uploads/images/');
        } else if (file.mimetype === 'application/pdf') {
            cb(null, 'uploads/files/');
        } else {
            cb(new Error('Invalid file type'));
        }
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

const fileFilter = function (req, file, cb) {
    const allowedImageExtensions = ['.png', '.jpg', '.jpeg'];
    const allowedPdfExtension = ['.pdf'];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (
        file.mimetype.startsWith('image') &&
        allowedImageExtensions.includes(fileExtension)
    ) {
        cb(null, true);
    } else if (
        file.mimetype === 'application/pdf' &&
        allowedPdfExtension.includes(fileExtension)
    ) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type or extension'));
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: fileFilter
}).fields([
    { name: 'images', maxCount: 4 },
    { name: 'pdfFile', maxCount: 1 }
]);

module.exports = upload;