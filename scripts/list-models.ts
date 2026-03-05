import { GoogleGenerativeAI } from '@google/generative-ai';
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
        const genAI = new GoogleGenerativeAI(apiKey);
        console.log('Listing models...');

        console.log('Using @google/generative-ai. Defaulting to common models:');
        console.log('- gemini-1.5-pro');
        console.log('- gemini-1.5-flash');
        console.log('- gemini-pro-vision');

    } catch (error: any) {
        console.error('Error listing models:', error.message);
    }
}

listModels();
