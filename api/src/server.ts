import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import productsRouter from './routes/products';
import usersRouter from './routes/users';
import cors from 'cors';
import UserModel, { User } from './models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DocumentType } from '@typegoose/typegoose';
import { UserToken } from './types';
import ordersRouter from './routes/orders';
import { requireLogin } from './middleware';

const PORT = 5000;

const mongoDb = 'mongodb://host.docker.internal:27017/shop';
const secret = '5tr0n6P@55W0rD';

function generateToken(user: DocumentType<User>) {
    const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
    } as UserToken;
    const oneDay = 60 * 60 * 24;
    return jwt.sign(payload, secret, { expiresIn: oneDay });
}

const main = async () => {
    await mongoose.connect(mongoDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const app = express();

    app.use(express.static('public'));
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/products', requireLogin, productsRouter);
    app.use('/users', usersRouter);
    app.use('/orders', requireLogin, ordersRouter);
    app.post('/login', async (req, res) => {
        let { email, password } = req.body;
        let user = await UserModel.findOne({ email: email });

        if (user) {
            let success = bcrypt.compareSync(password, user.password);
            const accessToken = generateToken(user);
            res.cookie('authorization', accessToken, {
                secure: true,
                httpOnly: true,
            });
            if (success === true) res.status(200).send('successful login');
            else res.status(404).send('Invalid credentials');
        } else {
            res.status(404).send('Invalid credentials');
        }
    });

    app.get('/logout', async (_, res) => {
        try {
            res.clearCookie('authorization');
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(201);
        }
    });

    app.use('/', (_, res) => {
        res.send('Hello!');
    });

    app.listen(PORT, () => {
        console.log('Server running????');
    });
};

main().catch(console.error);
