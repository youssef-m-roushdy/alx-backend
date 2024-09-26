const redis = require('redis');
const { promisify } = require('util');

// Create the Redis client
const client = redis.createClient({
  url: 'redis://localhost:6379'
});

// Handle successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Handle connection error
client.on('error', (err) => {
  console.error('Redis client not connected to the server:', err.message);
});

// Promisify the client.get method to work with async/await
const getAsync = promisify(client.get).bind(client);

// Set a new key-value pair in Redis
const setNewSchool = (schoolName, value) => {
  client.set(schoolName, value, (err, reply) => {
    if (err) {
      console.error('Error setting value:', err.message);
    } else {
        redis.print(null, reply);  // Logs the Redis response for the set command
    }
  });
};

// Retrieve and display the value of a given key from Redis using async/await
const displaySchoolValue = async (schoolName) => {
  try {
    const value = await getAsync(schoolName);
    console.log(value);
  } catch (err) {
    console.error('Error retrieving value:', err.message);
  }
};

// Example usage
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
