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

client.hset('HolbertonSchools', 'Portland', '50', (err, res) => {
  redis.print(err, res);
})
client.hset('HolbertonSchools', 'Seattle', '80', (err, res) => {
    redis.print(err, res);
})
client.hset('HolbertonSchools', 'New York', '20', (err, res) => {
    redis.print(err, res);
})
client.hset('HolbertonSchools', 'Bogota', '20', (err, res) => {
    redis.print(err, res);
})
client.hset('HolbertonSchools', 'Cali', '40', (err, res) => {
redis.print(err, res);
})
client.hset('HolbertonSchools', 'Paris', '2', (err, res) => {
    redis.print(err, res);
})

client.hgetall('HolbertonSchools', (err, result) => {
    if (err) {
        console.error('Error fetching HolbertonSchools:', err);
    } else {
        console.log('HolbertonSchools:', result);
    }
    client.quit();
});
         