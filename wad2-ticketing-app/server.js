import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cors from 'cors';
import axios from 'axios';

// Initialize the app
const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// API endpoint for fetching events
app.get('/api/events', async (req, res) => {
    try {
        const username = process.env.EVENTFINDA_USERNAME; 
        const password = process.env.EVENTFINDA_PASSWORD; 
        const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

       //req body
        const response = await axios.get('https://api.eventfinda.sg/v2/events.json', {
            headers: { Authorization: authHeader },
        });
        
        // Send data from the external API back to the client-side
        res.json(response.data);
    } catch (error) {
        // Log error and send a generic message to the client
        console.error('Error fetching events:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
