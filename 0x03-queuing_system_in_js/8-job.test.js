const { expect } = require('chai');
const kue = require('kue');
const sinon = require('sinon');
import createPushNotificationsJobs from './8-job.js';

describe('test function createPushNotificationsJobs', () => {
    let queue;

    beforeEach(() => {
        queue = kue.createQueue();
        kue.Job.rangeByType = function(type, start, end, state, callback) {
            callback(null, []);
        };
        queue.testMode.enter();
    });

    afterEach(() => {
        queue.testMode.clear();  // Clear jobs after each test
        queue.testMode.exit();   // Exit test mode
    });

    it('should throw an error if jobs is not an array', () => {
        expect(() => createPushNotificationsJobs({}, queue)).to.throw(Error, 'Jobs is not an array');
    });

    it('should create jobs when jobs is an array', () => {
        const jobs = [
            { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' },
            { phoneNumber: '4153518781', message: 'This is the code 5678 to verify your account' }
        ];

        createPushNotificationsJobs(jobs, queue);

        expect(queue.testMode.jobs.length).to.equal(2);  // Two jobs should be created
        expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
        expect(queue.testMode.jobs[1].data).to.deep.equal(jobs[1]);
    });

    it('should log the job creation', () => {
        const jobs = [
            { phoneNumber: '4153518780', message: 'This is the code 1234 to verify your account' }
        ];
    
        const spy = sinon.spy(console, 'log');
    
        createPushNotificationsJobs(jobs, queue);
    
        // Check if we are in test mode
        if (queue.testMode) {
            expect(spy.calledWith('Notification job created in test mode')).to.be.true;
        } else {
            // In normal mode, match the message with the job ID
            expect(spy.calledWithMatch(/Notification job created: \d+/)).to.be.true;
        }
    
        spy.restore();
    });    
});
