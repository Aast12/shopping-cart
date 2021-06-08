import express from 'express';
import { requireAdmin } from '../middleware';
import Product from '../models/Product';

import { createImage } from '../services/media';
import { upload } from '../services/multer';

const router = express.Router();

router.get('/', async (_, res) => {
    const products = await Product.find({});

    res.send(products);
});

router.get('/:id', async (req, res) => {
    const products = await Product.findById(req.params.id);

    res.send(products);
});

router.post(
    '/create',
    requireAdmin,
    upload.single('image'),
    async (req, res) => {
        try {
            const newProduct = new Product(req.body);

            if (req.file) {
                newProduct.image = createImage(req.file);
            }

            await newProduct.save();
            res.status(200).send({
                id: newProduct._id,
            });
        } catch (err) {
            res.status(500).send(err);
        }
    }
);

router.put('/:id', requireAdmin, upload.single('image'), async (req, res) => {
    const _id = req.params.id;

    try {
        const values = req.body;

        if (req.file) {
            await Product.updateOne(
                { _id },
                {
                    ...values,
                    image: createImage(req.file),
                }
            );
        } else {
            await Product.updateOne({ _id }, values);
        }

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.delete('/:id', requireAdmin, async (req, res) => {
    const _id = req.params.id;

    try {
        await Product.deleteOne({ _id });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;
