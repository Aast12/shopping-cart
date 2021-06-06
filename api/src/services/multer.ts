import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (_, file, callback) => {
        console.log(file.fieldname);
        callback(null, file.fieldname + '-' + Date.now());
    },
});

export const upload = multer({ storage: storage });
