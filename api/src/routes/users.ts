import express, { Request } from 'express';

import { createImage } from '../services/media';
import { upload } from '../services/multer';
import User from '../models/User';
import { requireLogin } from '../middleware';

const router = express.Router();

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        if (await User.findOne({ email: req.body.email })) {
            return res.status(409).send({ message: 'Email already in use' });
        }
        const newUser = new User(req.body);

        if (req.file) {
            newUser.profilePicture = createImage(req.file);
        }

        await newUser.save();
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send({ message: 'The user could not be created' });
    }
    return;
});

router.get('/', requireLogin, async (req: Request, res) => {
    // @ts-ignore
    if (!req.user) res.sendStatus(401);
    else {
        // @ts-ignore
        const { id } = req.user;
        try {
            const user = await User.findById(id);

            res.status(200).send(user);
        } catch {
            res.sendStatus(401);
        }
    }
});

router.put(
    '/:id',
    requireLogin,
    upload.single('profilePicture'),
    async (req, res) => {
        // @ts-ignore
        if (req.user?.id !== req.params.id) {
            res.sendStatus(401);
        } else {
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
                    await User.updateOne({ _id: req.params.id }, values);
                }

                res.sendStatus(200);
            } catch (err) {
                res.status(500).send(err);
            }
        }
    }
);

router.delete('/', requireLogin, async (req, res) => {
    // @ts-ignore
    if (!req.user) {
        res.sendStatus(401);
    } else {
        // @ts-ignore
        const { id } = req.user;
        try {
            await User.deleteOne({ _id: id });
            res.sendStatus(200);
        } catch (err) {
            res.status(500).send(err);
        }
    }
});

export default router;
