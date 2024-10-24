import axios from 'axios';

export const fetchEvents = async () => {
    try {
        // Make the API call to your Express server
        const response = await axios.get('http://localhost:5001/api/events');
        return response.data; // Adjust based on the actual response structure
    } catch (error) {
        console.error('Error fetching events:', error.message);
        throw error; // Re-throw error for further handling if needed
    }
};
