import express from 'express';
// const helper = require('../helpers');

const router = express.Router();

router.get('/', async (_, res) => {
    res.render('index', {
        title: 'Express',
    });
});

export default router;
