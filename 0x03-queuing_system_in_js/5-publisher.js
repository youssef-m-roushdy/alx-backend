const redis = require('redis');

const client = redis.createClient({
  url: 'redis://localhost:6379'
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error('Redis client not connected to the server:', err.message);
});

const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`); // Updated to include the message
    client.publish('holberton school channel', message, (err, reply) => {
      if (err) {
        console.error('Error publishing message:', err.message);
      } else {
      }
    });
  }, time);
};

// Publish messages
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
