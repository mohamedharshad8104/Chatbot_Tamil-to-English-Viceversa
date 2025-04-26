document.addEventListener('DOMContentLoaded', () => {
    // Connect to the server - explicitly specify the URL to ensure proper connection
    const socket = io(window.location.origin);
    
    // DOM Elements
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const languageSelector = document.getElementById('languageSelector');
    
    // Store the current user's language preference
    let userLanguage = 'english';
    
    // Debug connection status and add visual indicator
    const addDebugMessage = (message) => {
        console.log(message);
        const debugMsg = document.createElement('div');
        debugMsg.classList.add('message', 'system');
        debugMsg.innerHTML = `<div class="message-content system-message">${message}</div>`;
        chatContainer.appendChild(debugMsg);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };
    
    // Update language preference when changed
    languageSelector.addEventListener('change', (e) => {
        userLanguage = e.target.value;
        console.log('Language changed to:', userLanguage);
        // Inform server about language change
        socket.emit('change_language', userLanguage);
    });
    
    // Function to send a message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addDebugMessage(`Attempting to send: "${message}"`);
            
            // Send the message to the server
            socket.emit('send_message', {
                content: message,
                language: userLanguage
            });
            
            // Clear the input field
            messageInput.value = '';
            
            // Focus back on input for better UX
            messageInput.focus();
        }
    }
    
    // Send message on button click
    sendButton.addEventListener('click', () => {
        console.log("Send button clicked");
        sendMessage();
    });
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log("Enter key pressed");
            sendMessage();
        }
    });
    
    // Function to add a message to the chat
    function addMessageToChat(message, isCurrentUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isCurrentUser ? 'sent' : 'received');
        
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                         now.getMinutes().toString().padStart(2, '0');
        
        // The original content will be shown in the language the user sent it in
        // The translation will be shown below in the other language
        const originalContent = message.original;
        const translatedContent = message.translated;
        
        messageElement.innerHTML = `
            <div class="message-content">${originalContent}</div>
            <div class="message-translation">${translatedContent}</div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatContainer.appendChild(messageElement);
        
        // Scroll to the bottom of the chat container
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Listen for incoming messages
    socket.on('receive_message', (message) => {
        console.log('Received message:', message);
        
        // Determine if this message was sent by the current user
        const isCurrentUser = message.senderLanguage === userLanguage;
        
        // Handle received message
        addMessageToChat(message, isCurrentUser);
    });
    
    // Listen for connection events
    socket.on('connect', () => {
        addDebugMessage('Connected to server ✅');
        console.log('Socket ID:', socket.id);
    });
    
    socket.on('disconnect', () => {
        addDebugMessage('Disconnected from server ❌');
    });
    
    // Handle any errors
    socket.on('connect_error', (error) => {
        addDebugMessage(`Connection error: ${error.message}`);
    });
    
    // Test function to check if basic DOM events are working
    // This adds a test message when you click anywhere in the chat container
    chatContainer.addEventListener('click', () => {
        console.log('Chat container clicked - DOM events are working');
    });
    
    // Add initial status message
    addDebugMessage('Initializing chat... connecting to server');
});
