import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../app';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'asdfasdf';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    if (mongoose.connection.db) {
        //If we have data
        const collections = await mongoose.connection.db.collections();

        //Delete all data
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
        await mongoose.connection.close();
    }
});

global.signin = () => {
    //Build a JWT payload. { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com',
    };

    //Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //Build session Object. { jwt: MY_JWT }
    const session = { jwt: token };

    //Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    //Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    //Return string that's the cookie with encoded data
    return [`session=${base64}`];
};
