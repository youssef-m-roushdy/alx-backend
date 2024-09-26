const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const port = 1245;

const client = redis.createClient({
    url: 'redis://localhost:6379'
});

client.on('connect', () => {
    console.log('Redis client connected to the server');
});

client.on('error', (err) => {
    console.error('Redis client not connected to the server:', err.message);
});

// Promisify the Redis client methods
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Sample products list
const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

// Function to get item by ID
const getItemById = (id) => {
    return listProducts.find(product => product.itemId === id);
};

// Function to reserve stock by ID
const reserveStockById = async (itemId, stock) => {
    await setAsync(`item.${itemId}`, stock);
};

// Function to get current reserved stock by ID
const getCurrentReservedStockById = async (itemId) => {
    const stock = await getAsync(`item.${itemId}`);
    return stock ? parseInt(stock, 10) : 0; // Return 0 if no stock reserved
};

// Route to list all products
app.get('/list_products', (req, res) => {
    res.json(listProducts);
});

// Route to get a product by ID
app.get('/list_products/:itemId', async (req, res) => {
    const id = parseInt(req.params.itemId, 10); // Ensure id is a number
    const product = getItemById(id);
    
    if (!product) {
        return res.json({ "status": "Product not found" });
    }

    const currentQuantity = await getCurrentReservedStockById(id);
    res.json({ ...product, currentQuantity });
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
    const id = parseInt(req.params.itemId, 10); // Ensure id is a number
    const product = getItemById(id);
    
    if (!product) {
        return res.json({ "status": "Product not found" });
    }

    // Get current reserved stock
    const currentReservedStock = await getCurrentReservedStockById(id);
    const availableStock = product.initialAvailableQuantity - currentReservedStock;

    if (availableStock <= 0) {
        return res.json({ "status": "Not enough stock available", "itemId": id });
    }

    // Reserve stock by decrementing the reserved stock
    await reserveStockById(id, currentReservedStock + 1);
    res.json({ "status": "Reservation confirmed", "itemId": id });
});

// Start the server
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
