
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return;
    }

    try {
        const genAI = new GoogleGenAI({ apiKey });
        console.log('Listing models...');
        // The list method might be on models property
        // Following official SDK patterns
        const response = await genAI.models.list();
        console.log('Available models:');
        
        // Response might be a list directly or have a models property
        const models = response.models || response;
        
        if (Array.isArray(models)) {
            models.forEach(m => {
                console.log(`- ${m.name} (${m.displayName})`);
                console.log(`  Methods: ${m.supportedGenerationMethods ? m.supportedGenerationMethods.join(', ') : 'N/A'}`);
            });
        } else {
            console.log('Unexpected response format:', JSON.stringify(response, null, 2));
        }
    } catch (error) {
        console.error('Error listing models:', error.message);
        if (error.stack) console.error(error.stack);
    }
}

listModels();
