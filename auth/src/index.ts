import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    //Typeguard for typescript to know: the environment variable is NOT undefined
    if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('Listen on 3000!!!');
    });
};

start();
