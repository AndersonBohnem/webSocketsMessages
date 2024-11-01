let username;
let currentChat;
let socket;
const messages = {};

username = localStorage.getItem("userCurrent");

currentChat = localStorage.getItem('currentChat') || '/ChatOne';

if (currentChat) {
    connectWebSocket();
} else {
    console.log('Nenhum chat selecionado. Por favor, escolha uma conversa.');
}

function connectWebSocket() {

    if (socket) {
        socket.close();
    }

    const chatPath = `/${currentChat}`;
    console.log(chatPath);
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
        } else {
            console.log(`Mensagem ignorada. Esperado: ${currentChat}, recebido: ${data.chat}`);
        }
    });

    socket.addEventListener('close', function() {
        console.log(`Desconectado do WebSocket do chat ${currentChat}`);
    });        
}

function selectConversation(conversa) {
    currentChat = conversa; 
    localStorage.setItem('currentChat', currentChat);
    const conversationContent = document.getElementById('conversationContent');
    conversationContent.innerHTML = ''; 

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

        displayMessage(formattedMessage);

        messageInput.value = '';
    } else {
        console.log('Digite uma mensagem antes de enviar, nome de usuário ou chat não definido.');
    }
}

function displayMessage(message) {
    console.log('Exibindo mensagem:', message);
    const conversationContent = document.getElementById('conversationContent');
    const newMessage = document.createElement('div');
    newMessage.textContent = message;
    conversationContent.appendChild(newMessage);
}
