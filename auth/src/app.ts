import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { Request, Response, NextFunction } from 'express';
import { errorHandler, NotFoundError } from '@sealsdev/commonservice';

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

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

//Route not found - how it's done in the express docs
// app.all('*', async (req, res, next) => {
//     next(new NotFoundError());
// });

//Route not found - using the tiny package: "express-async-errors", this simplified method will also work
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

export { app };
