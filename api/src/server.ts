import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import productsRouter from './routes/products';

const PORT = 5000;

const mongoDb = 'mongodb://host.docker.internal:27017/shop';

const main = async () => {
    await mongoose.connect(mongoDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const app = express();

    app.use(express.static('public'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/products', productsRouter);
    app.use('/', (_, res) => {
        res.send('Hello!');
    });

    app.listen(PORT, () => {
        console.log('Server running????');
    });
};

main().catch(console.error);
