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

import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRouter } from './routes/delete';
import { indexOrderRouter } from './routes';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);
app.use(currentUser);

app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.use(newOrderRouter);

//Route not found
app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

export { app };
