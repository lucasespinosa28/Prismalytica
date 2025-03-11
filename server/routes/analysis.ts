import express from 'express';
import { Gemini, GEMINI_EMBEDDING_MODEL, GEMINI_MODEL, GeminiEmbedding } from "@llamaindex/google";
import {
    Settings,
    VectorStoreIndex,
} from "llamaindex";
import { JSONReader } from '@llamaindex/readers/json';
import { decrementUserDailyCreditBySignature, getUserAddressBySignature, getUserDailyCreditByAddress } from '../lib/userDb';

const router = express.Router();

/**
 * POST /api/analysis
 * Generate a market analysis report using Gemini AI
 * Request body: { 
 *   poolAddress?: string,
 *   timeframe?: string,
 *   aggregate?: number,
 *   limit?: number,
 *   currency?: string,
 *   customPrompt?: string
 * }
 */
router.post('/', async (req: any, res: any) => {
    try {
        // Check for API key
        if (!process.env.GOOGLE_API_KEY) {
            return res.status(500).json({
                success: false,
                message: "Google API key is not configured on the server"
            });
        }

        // Extract parameters from request body with defaults
        const {
            customPrompt,
            address,
            signature,
            data,

        } = req.body;

        // Validate request body
        if (!customPrompt || !address || !signature) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: prompt, address, or signature'
            });
        }

        // Verify signature by checking if the address matches
        const storedAddress = await getUserAddressBySignature(signature);

        // If no address found with this signature or addresses don't match
        if (!storedAddress) {
            return res.status(401).json({
                success: false,
                message: 'Invalid signature'
            });
        }

        if (storedAddress.toLowerCase() !== address.toLowerCase()) {
            return res.status(401).json({
                success: false,
                message: 'Address does not match the signature'
            });
        }

        const credit = await getUserDailyCreditByAddress(address)
    
        // Check if user has enough daily credit
        if (!credit || credit <= 0) {
          return res.status(403).json({
            success: false,
            message: 'Insufficient daily credit. Please try again tomorrow.'
          });
        }
        

        // Initialize Gemini models
        const gemini = new Gemini({
            model: GEMINI_MODEL.GEMINI_2_0_FLASH,
        });

        const embedModel = new GeminiEmbedding({
            model: GEMINI_EMBEDDING_MODEL.EMBEDDING_001,
        });

        // Configure LlamaIndex to use Gemini
        Settings.llm = gemini;
        Settings.embedModel = embedModel;

        // Set prompt (use custom if provided, otherwise default)
        const prompt = customPrompt ||
            "Analyze the latest market data and provide key insights on price movements, trends, and potential trading opportunities, and write a report like a financial report.";

        // Prepare data for LlamaIndex
        const jsonlBuffer = new TextEncoder().encode(JSON.stringify(data));
        const reader = new JSONReader({ isJsonLines: true });
        const document = await reader.loadDataAsContent(jsonlBuffer);

        // Create vector index and query engine
        const index = await VectorStoreIndex.fromDocuments(document);
        const queryEngine = index.asQueryEngine();

        // Generate analysis
        const { message } = await queryEngine.query({
            query: prompt,
        });

        // Get the analysis content
        const analysisContent = message.content.toString();
        
       await decrementUserDailyCreditBySignature(signature)

        // Return the analysis to the client
        return res.status(200).json({
            success: true,
            analysis: {
                content: analysisContent,
                prompt: prompt
            },
        });

    } catch (error) {
        console.error('Error generating analysis:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while generating analysis',
            error: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;