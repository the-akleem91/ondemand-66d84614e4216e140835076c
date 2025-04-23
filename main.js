
const axios = require('axios');

const API_KEY = '<replace_api_key>';
const EXTERNAL_USER_ID = '<replace_external_user_id>';
const BASE_URL = 'https://api-dev.on-demand.io/chat/v1';

// Function to create a chat session
async function createChatSession() {
  try {
    const response = await axios.post(`${BASE_URL}/sessions`, {
      agentIds: [],
      externalUserId: EXTERNAL_USER_ID
    }, {
      headers: {
        'apikey': API_KEY
      }
    });

    if (response.status === 201) {
      return response.data.data.id;
    } else {
      throw new Error('Failed to create chat session');
    }
  } catch (error) {
    console.error('Error creating chat session:', error);
    throw error;
  }
}

// Function to submit a query
async function submitQuery(sessionId, query, responseMode = 'sync') {
  try {
    const response = await axios.post(`${BASE_URL}/sessions/${sessionId}/query`, {
      endpointId: 'predefined-openai-gpt4o',
      query: query,
      agentIds: [
        'plugin-1713962163', 'plugin-1720113770', 'plugin-1720126666',
        'plugin-1720615360', 'plugin-1713954536', 'plugin-1713958830',
        'plugin-1713961903', 'plugin-1713967141'
      ],
      responseMode: responseMode,
      reasoningMode: 'medium'
    }, {
      headers: {
        'apikey': API_KEY
      },
      responseType: responseMode === 'stream' ? 'stream' : 'json'
    });

    if (responseMode === 'stream') {
      response.data.on('data', (chunk) => {
        console.log('Received chunk:', chunk.toString());
      });
    } else {
      if (response.status === 200) {
        console.log('Query response:', response.data);
      } else {
        throw new Error('Failed to submit query');
      }
    }
  } catch (error) {
    console.error('Error submitting query:', error);
    throw error;
  }
}

// Example usage
(async () => {
  try {
    const sessionId = await createChatSession();
    await submitQuery(sessionId, 'Put your query here', 'sync'); // Change 'sync' to 'stream' for streaming response
  } catch (error) {
    console.error('Error in chat process:', error);
  }
})();
