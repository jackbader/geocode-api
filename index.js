require('dotenv').config();

const express = require('express');
const NodeGeocoder = require('node-geocoder');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // This will enable CORS for all routes

app.get('/', (req, res) => {
  res.send('Hello from geocode server!');
});

const options = {
    provider: 'opencage',
    apiKey: process.env.OPENCAGE_API_KEY,
};
  
const geocoder = NodeGeocoder(options);
  
// Function to simulate sleep.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  
app.post('/geocode', async (req, res) => {
    const addresses = req.body.addresses;
    if (!addresses || !Array.isArray(addresses)) {
        return res.status(400).send('Invalid request: Send an array of addresses.');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for (const address of addresses) {
        const result = await geocoder.geocode(address);
        res.write(`data: ${JSON.stringify(result)}\n\n`);
        await sleep(1000);
    }

    res.end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});