document.addEventListener('DOMContentLoaded', loadMessages);

async function loadMessages() {
    const response = await fetch('/messages');
    const messages = await response.json();
    const messagesContainer = document.getElementById('messagesContainer');

    messagesContainer.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `<span class="username">${msg.username}:</span> ${msg.text} — ${new Date(msg.createdAt).toLocaleString()}`;
        messagesContainer.appendChild(div);
    });
}

async function postMessage() {
    const messageInput = document.getElementById('messageInput');

    if (messageInput.value.trim() !== '') {
        const response = await fetch('/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: messageInput.value })
        });

        if (response.ok) {
            messageInput.value = '';
            loadMessages();
        }
    }
}