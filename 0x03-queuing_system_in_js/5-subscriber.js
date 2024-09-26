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


client.subscribe('holberton school channel', (err, reply) => {
  if (err) {
    console.error('Failed to subscribe:', err.message);
  } else {
    console.log(`Subscribed to channel: ${reply}`);
  }
});

// Listen for messages on the subscribed channel
client.on('message', (channel, message) => {
  
  // Check if the message is 'KILL_SERVER'
  if (message === 'KILL_SERVER') {
    console.log('KILL_SERVER received. Unsubscribing and quitting...');
    client.unsubscribe('holberton school channel', () => {
      console.log('Unsubscribed from channel');
      client.quit(() => {
        console.log('Redis client disconnected from the server');
        process.exit(0);
      });
    });
  }
});