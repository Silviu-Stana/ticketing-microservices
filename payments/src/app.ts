import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { Request, Response, NextFunction } from 'express';
import {
    errorHandler,
    NotFoundError,
    currentUser,
} from '@sealsdev/commonservice';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        //we need to run over http:// in test environment so that jest doesn't fail the tests
        // secure: process.env.NODE_ENV !== 'test',
        secure: false,
        //convert this to "secure: true" when deploying application with https://
    })
);
app.use(currentUser);
app.use(createChargeRouter);

//Route not found
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

export default app;
