// 6-job_processor.js
const kue = require('kue');
const queue = kue.createQueue();

const sendNotification = (phoneNumber, message) => {
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
};

// Process push_notification_code jobs
queue.process('push_notification_code', (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message);
    done(); // Signal completion
});

// Log when a job is complete
queue.on('job complete', (id) => {
    console.log(`Notification job completed: ${id}`);
});

// Log when a job fails
queue.on('job failed', (id, errorMessage) => {
    console.log(`Notification job failed: ${id}, Error: ${errorMessage}`);
});
