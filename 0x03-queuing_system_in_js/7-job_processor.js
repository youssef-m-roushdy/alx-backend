const kue = require('kue');
const queue = kue.createQueue();
const redis = require('redis');
const client = redis.createClient();

// Array of blacklisted phone numbers
const blacklistedNumbers = [
    '4153518780',
    '4153518781'
];

// Function to send notification
function sendNotification(phoneNumber, message, job, done) {
    // Track progress of the job
    job.progress(0, 100);
    console.log(`Notification job #${job.id} 0% complete`);
    
    // Check if the phone number is blacklisted
    if (blacklistedNumbers.includes(phoneNumber)) {
        // Fail the job with an error
        const error = new Error(`Phone number ${phoneNumber} is blacklisted`);
        console.log(`Notification job #${job.id} failed: ${error.message}`);
        return done(error);
    } 
    
    // Update job progress to 50%
    job.progress(50, 100);
    console.log(`Notification job #${job.id} 50% complete`);

    // Log sending notification
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    
    // Simulate sending the notification
    setTimeout(() => {
        // Complete the job
        job.progress(100, 100);
        console.log(`Notification job #${job.id} completed`);
        done();
    }, 2000); // Simulating a delay in sending the notification
}

// Create a job for sending notifications
queue.process('push_notification_code_2', 2, (job, done) => {
    const { phoneNumber, message } = job.data;
    sendNotification(phoneNumber, message, job, done);
});

// Adding jobs to the queue with test data
const testNotifications = [
    { phoneNumber: '4153518780', message: 'This is the code 4321 to verify your account.' }, // Blacklisted
    { phoneNumber: '4153518781', message: 'This is the code 4562 to verify your account.' }, // Blacklisted
    { phoneNumber: '4153518743', message: 'This is the code 4321 to verify your account.' },
    { phoneNumber: '4153538781', message: 'This is the code 4562 to verify your account.' },
    { phoneNumber: '4153118782', message: 'This is the code 4321 to verify your account.' },
    { phoneNumber: '4153718781', message: 'This is the code 4562 to verify your account.' },
    { phoneNumber: '4159518782', message: 'This is the code 4321 to verify your account.' },
    { phoneNumber: '4158718781', message: 'This is the code 4562 to verify your account.' },
    { phoneNumber: '4153818782', message: 'This is the code 4321 to verify your account.' },
    { phoneNumber: '4154318781', message: 'This is the code 4562 to verify your account.' },
    { phoneNumber: '4151218782', message: 'This is the code 4321 to verify your account.' }
];

// Enqueue the test notifications
testNotifications.forEach(notification => {
    queue.create('push_notification_code_2', notification).save();
});

// Log completed jobs
queue.on('job complete', (id) => {
    console.log(`Job ${id} completed.`);
}).on('job failed', (id, err) => {
    console.log(`Job ${id} failed with error: ${err.message}`);
});

