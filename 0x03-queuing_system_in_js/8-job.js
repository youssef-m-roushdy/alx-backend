const kue = require('kue');
const queue = kue.createQueue();

const createPushNotificationsJobs = (jobs, queue) => {
    if (!Array.isArray(jobs)) {
        throw new Error("Jobs is not an array");
    }

    jobs.forEach(job => {
        const jobInQueue = queue.create('push_notification_code_3', job).save((err) => {
            if (err) {
                console.error(`Error creating job: ${err}`);
            } else {
                if (queue.testMode) {
                    console.log('Notification job created in test mode');
                } else {
                    console.log(`Notification job created: ${jobInQueue.id}`);
                }
            }
        });

        if (jobInQueue) {
            jobInQueue.on('complete', () => {
                console.log(`Notification job ${jobInQueue.id} completed`);
            });

            jobInQueue.on('failed', (error) => {
                console.log(`Notification job ${jobInQueue.id} failed: ${error}`);
            });

            jobInQueue.on('progress', (progress) => {
                console.log(`Notification job ${jobInQueue.id} ${progress}% complete`);
            });
        }
    });
};

module.exports = createPushNotificationsJobs;