const apiUrl = "/api/chat";

const send = document.getElementById("send");
const chatBox = document.querySelector(".chat-box");
const input = document.getElementById("inputValue");
const suggestions = document.querySelectorAll(".suggestions span");

// Add message to chat
function addMessage(text, sender, isLoading = false) {
    const messageDiv = document.createElement("div");

    messageDiv.classList.add(
        "message",
        sender === "user" ? "user-message" : "bot-message"
    );

    if (isLoading) {
        messageDiv.classList.add("loading");
        messageDiv.innerHTML = "<span class='dots'>...</span>";
    } else {
        messageDiv.innerHTML = text.replace(/\n/g, "<br>");
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    return messageDiv;
}

// Generate AI response
async function generateAns() {
    try {
        const ques = input.value.trim();

        if (!ques) return;

        addMessage(ques, "user");
        input.value = "";

        const loaderMessage = addMessage("", "bot", true);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
    "Content-Type": "application/json"
},
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: ques
                            }
                        ]
                    }
                ]
            })
        });

        if (response.status === 503) {
    loaderMessage.remove();
    addMessage(
        "Gemini is currently busy. Please try again in a few seconds.",
        "bot"
    );
    return;
}

if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${errorText}`);
}

        const data = await response.json();

        console.log("Gemini Response:", data);

        const aiResponse =
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't generate a response.";

        loaderMessage.remove();

        addMessage(aiResponse, "bot");
    } catch (error) {
        console.error("Error:", error);

        document
            .querySelectorAll(".loading")
            .forEach(el => el.remove());

        addMessage(
            `Error: ${error.message}`,
            "bot"
        );
    }
}

// Send button
if (send) {
    send.addEventListener("click", generateAns);
}

// Enter key
if (input) {
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            generateAns();
        }
    });
}

// Suggestion buttons
suggestions.forEach((suggestion) => {
    suggestion.addEventListener("click", () => {
        input.value = suggestion.textContent;
        input.focus();
    });
});