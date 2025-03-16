import express from 'express';
import { body } from 'express-validator';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { Password } from '../services/password';
import { BadRequestError, validateRequest } from '@sealsdev/commonservice';

const router = express.Router();

router.post(
    '/api/users/signin',
    [body('email').isEmail().withMessage('Email must be valid'), body('password').trim().notEmpty().withMessage('You must supply a password')],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) throw new BadRequestError('Invalid credentials.');

        const passwordsMatch = await Password.compare(existingUser.password, password);

        if (!passwordsMatch) throw new BadRequestError('Invalid credentials.');

        //Generate JWT
        const userJWT = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!);
        //Store it in session obj
        req.session = {
            jwt: userJWT,
        };

        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };
