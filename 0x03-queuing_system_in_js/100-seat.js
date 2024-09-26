const express = require('express');
const redis = require('redis');
const kue = require('kue');

const app = express();
const port = 1245;

// Create Redis client
const client = redis.createClient({
    url: 'redis://localhost:6379',
});

// Promisify Redis client methods
const { promisify } = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Initialize Kue queue
const queue = kue.createQueue();

// Initialize available seats
const INITIAL_SEATS = 50;
let reservationEnabled = true;

// Function to reserve seats
const reserveSeat = async (number) => {
    await setAsync('available_seats', number);
};

// Function to get current available seats
const getCurrentAvailableSeats = async () => {
    const seats = await getAsync('available_seats');
    return seats ? parseInt(seats, 10) : 0;
};

// Set initial available seats on application launch
reserveSeat(INITIAL_SEATS);

// GET /available_seats
app.get('/available_seats', async (req, res) => {
    const availableSeats = await getCurrentAvailableSeats();
    res.json({ numberOfAvailableSeats: availableSeats.toString() });
});

// GET /reserve_seat
app.get('/reserve_seat', (req, res) => {
    if (!reservationEnabled) {
        return res.json({ status: "Reservations are blocked" });
    }

    const job = queue.create('reserve_seat', {}).save((err) => {
        if (err) return res.json({ status: "Reservation failed" });
        res.json({ status: "Reservation in process" });
    });
});

// Job processing for seat reservation
queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();

    if (availableSeats <= 0) {
        reservationEnabled = false;
        return done(new Error('Not enough seats available'));
    }

    await reserveSeat(availableSeats - 1);
    console.log(`Seat reservation job ${job.id} completed`);
    done();
});

// GET /process
app.get('/process', async (req, res) => {
    res.json({ status: "Queue processing" });
    queue.process('reserve_seat'); // Start processing the queue
});

// Start the server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});

// Handle job completion and failure events
queue.on('job complete', (id) => {
    console.log(`Seat reservation job ${id} completed`);
});

queue.on('job failed', (id, err) => {
    console.log(`Seat reservation job ${id} failed: ${err.message}`);
});
