// ChatGPT Integration for SwipeCode
// API key is stored locally in browser localStorage

class ChatManager {
    constructor() {
        this.apiKey = localStorage.getItem('openai_api_key') || '';
        this.conversationHistory = [];
        this.isLoading = false;
    }

    // Check if API key is configured
    hasApiKey() {
        return this.apiKey && this.apiKey.startsWith('sk-');
    }

    // Save API key to localStorage
    saveApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('openai_api_key', key);
    }

    // Get stored API key
    getApiKey() {
        return this.apiKey;
    }

    // Clear API key
    clearApiKey() {
        this.apiKey = '';
        localStorage.removeItem('openai_api_key');
    }

    // Send message to ChatGPT
    async sendMessage(userMessage) {
        if (!this.hasApiKey()) {
            throw new Error('Please configure your OpenAI API key in settings.');
        }

        if (!userMessage.trim()) {
            throw new Error('Please enter a message first.');
        }

        this.isLoading = true;

        // Add user message to history
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant. The user is communicating with you using Morse code gestures (swipe up for dot, swipe down for dash). Keep your responses concise and friendly since they take effort to compose messages.'
                        },
                        ...this.conversationHistory
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }

            const data = await response.json();
            const assistantMessage = data.choices[0].message.content;

            // Add assistant response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });

            this.isLoading = false;
            return assistantMessage;

        } catch (error) {
            this.isLoading = false;
            // Remove the failed user message from history
            this.conversationHistory.pop();
            throw error;
        }
    }

    // Clear conversation history
    clearHistory() {
        this.conversationHistory = [];
    }
}

// Global chat manager instance
const chatManager = new ChatManager();
