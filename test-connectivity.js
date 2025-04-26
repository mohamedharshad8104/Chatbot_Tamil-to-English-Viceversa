// Save this as test-connectivity.js in your project root
// Run with: node test-connectivity.js

const http = require('http');

console.log('Testing server connectivity...');

// Test the server API endpoint
http.get('http://localhost:3000/api/test', (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Server response:', data);
        console.log('Server is running and responding ✅');
        console.log('\nIf the server is running but messages are still not sending:');
        console.log('1. Check browser console for JavaScript errors');
        console.log('2. Verify Socket.io connections in Network tab');
        console.log('3. Try a different browser');
    });
}).on('error', (err) => {
    console.error('Error connecting to server:', err.message);
    console.log('\nServer is not responding. Make sure:');
    console.log('1. Server is running (npm start)');
    console.log('2. You\'re using the correct port (default: 3000)');
    console.log('3. No firewall is blocking connections');
});