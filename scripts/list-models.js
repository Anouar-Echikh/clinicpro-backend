const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        console.log('Listing models...');
        
        // In the new SDK, we need to use the admin API or just knowing the models
        // However, the generative AI SDK doesn't have a simple listModels on the genAI instance anymore 
        // usually it's used directly.
        console.log('Using @google/generative-ai. Defaulting to common models:');
        console.log('- gemini-1.5-pro');
        console.log('- gemini-1.5-flash');
        console.log('- gemini-pro-vision');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

listModels();
