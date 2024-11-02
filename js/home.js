let username;
let currentChat;
let socket;
const messages = JSON.parse(localStorage.getItem("messages")) || {};

username = localStorage.getItem("userCurrent");

currentChat = localStorage.getItem('currentChat') || '/ChatOne';

function connectWebSocket() {
    const chatPath = `/${currentChat}`;
    console.log(chatPath);

    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
    }

    socket = new WebSocket(`ws://localhost:8888${chatPath}`);

    // Evento de conexão aberta
    socket.addEventListener('open', function(event) {
        console.log(`Conectado ao WebSocket para ${currentChat}`);
    });

    socket.addEventListener('message', function(event) {
        console.log('Mensagem recebida do servidor:', event.data);  
        const data = JSON.parse(event.data);
        if (currentChat === data.chat.substring(1)) {
            displayMessage(data.message); 
            if (!messages[currentChat]) {
                messages[currentChat] = []; 
            }
            messages[currentChat].push(data.message);
            saveMessages();
        } else {
            console.log(`Mensagem ignorada. Esperado: ${currentChat}, recebido: ${data.chat}`);
        }
    });
    }

function selectConversation(conversa) {
    currentChat = conversa; 
    localStorage.setItem('currentChat', currentChat);
    const conversationContent = document.getElementById('conversationContent');
    conversationContent.innerHTML = ''; 

    loadMessages();

    connectWebSocket();

    if (messages[currentChat]) {
        messages[currentChat].forEach(msg => displayMessage(msg));
    } else {
        conversationContent.innerHTML = `<div>Selecione uma mensagem para ver os detalhes.</div>`;
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (message && username && currentChat) {
        const formattedMessage = `${username}: ${message}`;
        
        socket.send(JSON.stringify({ chat: currentChat, message: formattedMessage })); 

        if (!messages[currentChat]) {
            messages[currentChat] = []; 
        }
        messages[currentChat].push(formattedMessage);
        
        saveMessages();

        displayMessage(formattedMessage);

        messageInput.value = '';
    } else {
        console.log('Digite uma mensagem antes de enviar, nome de usuário ou chat não definido.');
    }
}

function loadMessages() {
    if (currentChat) {
        console.log("true")
        const savedMessages = localStorage.getItem(`messages_${currentChat}`);
        messages[currentChat] = savedMessages ? JSON.parse(savedMessages) : [];
    } else {
        console.log("false")
        messages[currentChat] = [];
    }
}

function saveMessages() {
    localStorage.setItem(`messages_${currentChat}`, JSON.stringify(messages[currentChat]));
}

function displayMessage(message) {
    console.log('Exibindo mensagem:', message);
    const conversationContent = document.getElementById('conversationContent');
    const newMessage = document.createElement('div');
    newMessage.textContent = message;
    conversationContent.appendChild(newMessage);
}
