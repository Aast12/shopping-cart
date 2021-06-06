import fs from 'fs';

import path from 'path';

export const createImage = (
    { filename, mimetype }: Express.Multer.File,
    filepath?: string
): {
    data: Buffer; // An array
    contentType: string;
} => {
    return {
        data: fs.readFileSync(
            filepath ?? path.join(__dirname, '..', '..', 'uploads', filename)
        ),
        contentType: mimetype,
    };
};
