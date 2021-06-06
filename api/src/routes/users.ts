import express, { Request } from 'express';

import { createImage } from '../services/media';
import { upload } from '../services/multer';
import User from '../models/User';
import { requireLogin } from '../middleware';

const router = express.Router();

router.route('/').get(requireLogin, async (req: Request, res) => {
    // @ts-ignore
    const user = await User.findById(req.user.id);

    console.log('->', user);
    res.status(200).send(user);
});

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

router.put('/:id', upload.single('profilePicture'), async (req, res) => {
    try {
        const { ...values } = req.body;

        console.log(req.file);

        if (req.file) {
            console.log('XD');
            await User.updateOne(
                { _id: req.params.id },
                {
                    ...values,
                    profilePicture: createImage(req.file),
                }
            );
        } else {
            console.log('WASASTT');
            await User.updateOne({ _id: req.params.id }, values);
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
