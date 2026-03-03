
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return;
    }

    try {
        const genAI = new GoogleGenAI({ apiKey });
        console.log('Listing models...');
        const models = await genAI.models.list();
        console.log('Available models:');
        models.forEach(m => {
            console.log(`- ${m.name} (${m.displayName})`);
            console.log(`  Methods: ${m.supportedGenerationMethods.join(', ')}`);
        });
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
