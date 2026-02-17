const axios = require('axios');

async function testGenerate() {
    try {
        const response = await axios.post('http://localhost:5000/api/builds/generate', {
            budget: 1500,
            useCase: 'gaming'
        });
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response Data:', error.response.data);
        }
    }
}

testGenerate();
