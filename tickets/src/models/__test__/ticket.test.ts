import Ticket from '../ticket';

it('implements optimistic concurrency control', async () => {
    //Create ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });

    //Save to DB
    await ticket.save();

    //Fetch ticket 2x (both instances will have version=0)
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    //Make 2 updates
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    //expect 1st fetched ticket to work
    await firstInstance!.save();

    //expect 2nd fetched ticket to error, outdated version number (expect 1: got 0)
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123',
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});
