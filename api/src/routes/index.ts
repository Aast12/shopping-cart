import express from 'express';
import { getAllServices } from '../services/products';
// const helper = require('../helpers');

const router = express.Router();

router.get('/', async (_, res) => {
    const products = await getAllServices();
    res.render('index', {
        title: 'Express',
        products,
    });
});

export default router;
