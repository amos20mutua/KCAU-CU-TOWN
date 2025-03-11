document.addEventListener('DOMContentLoaded', function() {
    const messagesList = document.querySelector('.messages-list');
    const messageThread = document.querySelector('.message-thread');
    const replyTextarea = document.querySelector('.message-reply textarea');
    const sendButton = document.querySelector('.btn-send');

    // Simulated messages data
    const messages = [
        {
            id: 1,
            sender: 'Admin',
            subject: 'Weekly Meeting Update',
            content: 'Hello everyone, This week\'s meeting will be...',
            timestamp: '2024-01-20 10:00',
            replies: []
        }
        // Add more messages
    ];

    // Display messages in sidebar
    function displayMessages() {
        messagesList.innerHTML = messages.map(message => `
            <div class="message-item" data-id="${message.id}">
                <h4>${message.subject}</h4>
                <p>${message.sender}</p>
                <span>${message.timestamp}</span>
            </div>
        `).join('');
    }

    // Handle sending replies
    sendButton.addEventListener('click', function() {
        const replyText = replyTextarea.value.trim();
        if (replyText) {
            // Add reply to current message
            // This would normally involve an API call
            alert('Reply sent!');
            replyTextarea.value = '';
        }
    });

    // Initialize
    displayMessages();
}); 