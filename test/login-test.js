const axios = require('axios');
const open = require('open');

async function testLogin() {
  try {
    // Login to get token
    const loginResponse = await axios.post('http://localhost:8000/api/users/login', {
      email: 'testuser@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.accessToken;
    console.log('Successfully logged in. Token:', token);
    
    // Open dashboard with token in URL
    await open(`http://localhost:3001/dashboard?token=${token}`);
    console.log('Opened dashboard page in browser');
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testLogin();
