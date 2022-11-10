import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from "../middlewares/validate-request";
import { User } from '../models/user';

const router = express.Router()

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email mush be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password mus be between 4 and 20 characters')
], validateRequest, async (req: Request, res: Response) => {
    // define the exact input from the app
    const { email, password } = req.body;

    // find the spesific same email if it exists
    const existingUser = await User.findOne({ email });

    // throw an error if the user email does exist
    if (existingUser) {
        throw new BadRequestError('Email in use');
    }

    // a place to create and throw new User and save it to the database
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT and Store it on session object

    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!) // --> ! is for make sure JWT_KEY is defined in index.ts

    // store it on session object
    req.session = {
        jwt: userJwt
    }


    res.status(201).send(user);
})

export { router as signupRouter };
