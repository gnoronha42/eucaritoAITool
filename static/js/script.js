document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const newChatBtn = document.getElementById('new-chat-btn');

    // Ajustar altura do textarea conforme o conteúdo
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Enviar mensagem quando pressionar Enter (sem Shift)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Enviar mensagem ao clicar no botão
    sendBtn.addEventListener('click', sendMessage);

    // Nova conversa
    newChatBtn.addEventListener('click', function() {
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <div class="message-content">
                    <div class="avatar">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div class="text">
                        Olá! Sou a Eucarito AI, sua parceira para desenvolvimento integral. Estou aqui para ajudar você a alinhar mente, corpo e espírito, alcançando seu máximo potencial. Como posso guiar sua jornada de transformação hoje?
                    </div>
                </div>
            </div>
        `;
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Adicionar mensagem do usuário ao chat
        addMessage(message, 'user');
        
        // Limpar input e resetar altura
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Mostrar indicador de digitação
        const typingIndicator = addTypingIndicator();
        
        // Enviar mensagem para o backend
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message }),
        })
        .then(response => response.json())
        .then(data => {
            // Remover indicador de digitação
            typingIndicator.remove();
            
            // Adicionar resposta da IA
            addMessage(data.response, 'ai');
            
            // Rolar para o final da conversa
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => {
            // Remover indicador de digitação
            typingIndicator.remove();
            
            // Mostrar erro
            addMessage('Desculpe, ocorreu um erro ao processar sua mensagem.', 'ai');
            console.error('Error:', error);
        });
        
        // Rolar para o final da conversa
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const icon = sender === 'user' ? 'fa-user' : 'fa-brain';
        const bgColor = sender === 'user' ? '' : 'ai-message';
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="text">${formatMessage(text)}</div>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        return messageDiv;
    }
    
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message ai-message';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="avatar">
                    <i class="fas fa-brain"></i>
                </div>
                <div class="text">
                    <div class="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }
    
    function formatMessage(text) {
        // Converter quebras de linha em <br>
        return text.replace(/\n/g, '<br>');
    }

    function checkOllamaStatus() {
        fetch('/check-ollama')
            .then(response => response.json())
            .then(data => {
                alert(JSON.stringify(data, null, 2));
            })
            .catch(error => {
                alert('Erro ao verificar status do Ollama: ' + error);
            });
    }

    const checkStatusBtn = document.createElement('button');
    checkStatusBtn.textContent = 'Verificar Conexão';
    checkStatusBtn.style.position = 'absolute';
    checkStatusBtn.style.top = '10px';
    checkStatusBtn.style.right = '10px';
    checkStatusBtn.style.zIndex = '1000';
    checkStatusBtn.style.backgroundColor = 'var(--accent-color)';
    checkStatusBtn.style.color = 'white';
    checkStatusBtn.style.border = 'none';
    checkStatusBtn.style.padding = '5px 10px';
    checkStatusBtn.style.borderRadius = '4px';
    checkStatusBtn.addEventListener('click', checkOllamaStatus);
    document.body.appendChild(checkStatusBtn);
}); 