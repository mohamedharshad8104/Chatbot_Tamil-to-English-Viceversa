const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const cors = require('cors');
const translationAPI = require('./translationAPI');

// Create Express app
const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS settings
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Store connected users
const users = {};

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
    
    // Acknowledge connection to client
    socket.emit('server_message', { message: 'Connected to server' });
    
    // Store user information
    users[socket.id] = {
        id: socket.id,
        language: 'english' // Default language
    };
    
    // Handle language change
    socket.on('change_language', (language) => {
        console.log(`User ${socket.id} changed language to ${language}`);
        users[socket.id].language = language;
    });
    
    // Handle messages - fixed version
    socket.on('send_message', async (messageData) => {
        try {
            console.log('Received message from client:', messageData);
            
            // Safety check for message data
            if (!messageData || !messageData.content) {
                console.error('Invalid message data received');
                return;
            }
            
            const { content, language } = messageData;
            
            // Determine which translation direction to use
            const sourceLanguage = language || 'english'; // Default to English if not specified
            const targetLanguage = sourceLanguage === 'english' ? 'tamil' : 'english';
            
            console.log(`Translating from ${sourceLanguage} to ${targetLanguage}`);
            
            // Use a very basic mock translation for immediate testing
            let translatedText;
            if (sourceLanguage === 'english') {
                // Very simple translation for testing
                translatedText = content + " (translated to Tamil)";
                
                // Try the actual translation service
                try {
                    console.log('Calling translationAPI.translateText with:', {content, sourceLanguage, targetLanguage});
                    const actualTranslation = await translationAPI.translateText(content, sourceLanguage, targetLanguage);
                    console.log('TranslationAPI returned:', actualTranslation);
                    if (actualTranslation) {
                        translatedText = actualTranslation;
                    }
                } catch (translationError) {
                    console.error('Translation service error:', translationError);
                    // Keep the default translation for now
                }
            } else {
                // Simple reverse for Tamil to English
                translatedText = content + " (translated to English)";
                
                // Try the actual translation service
                try {
                    const actualTranslation = await translationAPI.translateText(content, sourceLanguage, targetLanguage);
                    if (actualTranslation) {
                        translatedText = actualTranslation;
                    }
                } catch (translationError) {
                    console.error('Translation service error:', translationError);
                    // Keep the default translation for now
                }
            }
            
            // Create the message object with original and translated content
            const messageObject = {
                original: content,
                translated: translatedText,
                senderLanguage: sourceLanguage,
                timestamp: new Date()
            };
            
            console.log('Broadcasting message to all clients:', messageObject);
            
            // Broadcast the message to all connected clients (including sender)
            io.emit('receive_message', messageObject);
            
        } catch (error) {
            console.error('Error handling message:', error);
            // Notify the sender that something went wrong
            socket.emit('error', { message: 'Failed to process your message' });
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete users[socket.id];
    });
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Add a test route to verify the server is running
app.get('/api/test', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
});