import request from 'supertest';
import app from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import Ticket from '../../models/ticket';

it('returns a 404 if id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', global.signin())
        .send({ title: 'aowihdw', price: 20 })
        .expect(404);
});

it('returns a 401 if user not logged in', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    //if we dont set a Cookie it means we are not logged in
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({ title: 'aowihdw', price: 20 })
        .expect(401);
});

it('returns a 401 if user does not own ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({ title: 'asoiwad', price: 20 });

    //every time we call global.signin() again it generates a random new user id
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({ title: 'aowihdo', price: 1000 })
        .expect(401);
});

it('returns a 400 if user provides invalid title or price', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'asoiwad', price: 20 });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: '', price: 20 })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'asoiwad', price: -10 })
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'asoiwad', price: 20 });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'new title', price: 100 })
        .expect(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'asoiwad', price: 20 });

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'new title', price: 100 })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if ticket is reserved', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({ title: 'toy', price: 20 });

    //User2 orders ticket
    // const response2= await.request
    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    //owner tries to update locked down ticket
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({ title: 'new title', price: 100 })
        .expect(400); //BadRequestError
});
