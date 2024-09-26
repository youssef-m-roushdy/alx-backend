// 6-job_creator.js
const kue = require('kue');
const queue = kue.createQueue();

const sendNotification = (phoneNumber, message) => {
    const job = queue.create('push_notification_code', {
        phoneNumber: phoneNumber,
        message: message
    });

    job.save((err) => {
        if (err) {
            console.error(`Error creating job: ${err}`);
        } else {
            console.log(`Notification job created: ${job.id}`);
        }
    });

    job.on('complete', () => {
        console.log(`Notification job completed: ${job.id}`);
    });

    job.on('failed', (errorMessage) => {
        console.log(`Notification job failed: ${errorMessage}`);
    });
};

// Create a new job (you can call this function as needed)
sendNotification(4153518780, 'This is the code to verify your account');
