import express from 'express';
import { requireLogin } from '../middleware';
import User from '../models/User';
import Product from '../models/Product';
import { upload } from '../services/multer';
import { mongoose } from '@typegoose/typegoose';
import Order, { OrderItem } from '../models/Order';

const router = express.Router();

router.post(
    '/create',
    requireLogin,
    upload.single('image'),
    async (req, res) => {
        // @ts-ignore
        if (!req.user) return res.sendStatus(401);

        const order = req.body as { id: string; quantity: number }[];

        if (!order || order.length === 0)
            return res.status(400).send({ message: 'Order can not be empty' });

        // @ts-ignore
        const { id } = req.user;

        try {
            const orderDocument = new Order();
            orderDocument.products = new mongoose.Types.Array<OrderItem>();

            let total = 0;

            for (let item of order) {
                const orderItem = new OrderItem();
                orderItem.quantity = item.quantity;

                const product = await Product.findById(item.id);

                if (!product) {
                    return res.status(404).send({
                        message: 'Invalid product ID',
                    });
                }

                if (product.stock < item.quantity) {
                    return res.status(500).send({
                        message: 'Product ran out of stock',
                    });
                }

                orderItem.product = product._id;
                orderItem.unitPrice = product.price;

                total += product.price * item.quantity;

                orderDocument.products.push(orderItem);

                product.stock -= item.quantity;
                product.save();
            }

            orderDocument.total = total;

            await User.findOneAndUpdate(
                {
                    _id: id,
                },
                {
                    $push: {
                        orders: orderDocument,
                    },
                }
            );

            res.status(200).send(orderDocument);
        } catch (err) {
            console.error(err);
            res.status(500).send({ message: err });
        }

        return;
    }
);

export default router;
