const apiKey = "AQ.Ab8RN6KFRmLvmnvZ1AXu6FXnCMrYTDk315BAGo0Ayvd25lsCpA"; // Replace with your actual API key
// const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;
const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

const send = document.getElementById('send');
const chatBox = document.querySelector('.chat-box');
const input = document.getElementById('inputValue');
const suggestions = document.querySelectorAll('.suggestions span');

// Function to add messages to chat
function addMessage(text, sender, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

    if (isLoading) {
        messageDiv.classList.add('loading'); // Add loading animation
        messageDiv.innerHTML = `<span class="dots">...</span>`; // Loading dots
    } else {
        messageDiv.innerHTML = text.replace(/\n/g, "<br>"); // Preserve formatting
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest message

    return messageDiv; // Return the element to remove it later if needed
}

// Function to call AI API
async function generateAns() {
    try {
        let ques = input.value.trim();
        if (!ques) {
            return;
        }

        // Show user's message in chat
        addMessage(ques, 'user');
        input.value = ''; // Clear input field

        // Show loader animation while waiting for AI response
        const loaderMessage = addMessage('', 'bot', true);

        // Call API
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": apiKey
},
            },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [{ text: ques }]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        // Remove loader animation
        loaderMessage.remove();

        // Show AI response in chat with proper formatting
        addMessage(aiResponse, 'bot');

    } catch (error) {
        console.error("Error fetching data:", error);
        addMessage("Error fetching AI response. Please try again.", 'bot');
    }
}

// Event listener for send button
send.addEventListener('click', generateAns);

// Event listener for Enter key
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateAns();
    }
});

// Handle suggestions click
suggestions.forEach(suggestion => {
    suggestion.addEventListener('click', () => {
        input.value = suggestion.textContent;
    });
});
