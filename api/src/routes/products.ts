import express from 'express';
import Product from '../models/Product';
// import { getAllServices } from '../services/products';

import { createImage } from '../services/media';
import { upload } from '../services/multer';

const router = express.Router();

router.get('/', async (_, res) => {
    // const products = await getAllServices();
    const products = await Product.find({});

    res.send(products);
});

router.get('/:id', async (req, res) => {
    // const products = await getAllServices();
    const products = await Product.findById(req.params.id);

    res.send(products);
});

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        const newProduct = new Product(req.body);

        if (req.file) {
            newProduct.image = createImage(req.file);
        }

        await newProduct.save();
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.put('/update', upload.single('image'), async (req, res) => {
    try {
        const { _id, ...values } = req.body;

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

router.delete('/delete', async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.body?.id });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;
