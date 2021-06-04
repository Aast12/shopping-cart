import express from 'express';
import Product from '../models/Product';

import { createImage } from '../services/media';
import { upload } from '../services/multer';
import User from '../models/User';

const router = express.Router();

// router.get('/', async (_, res) => {
//     const products = await getAllServices();

//     res.send(products);
// });

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const newUser = new User(req.body);

        if (req.file) {
            newUser.profilePicture = createImage(req.file);
        }

        await newUser.save();
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { ...values } = req.body;

        if (req.file) {
            await User.updateOne(
                { _id: req.params.id },
                {
                    ...values,
                    profilePicture: createImage(req.file),
                }
            );
        } else {
            await Product.updateOne({ _id: req.params.id }, values);
        }

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;
