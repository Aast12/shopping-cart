import multer from 'multer';

const storage = multer.diskStorage({
    destination: (_, __, callback) => {
        callback(null, 'uploads');
    },
    filename: (_, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now());
    },
});

export const upload = multer({ storage: storage });
