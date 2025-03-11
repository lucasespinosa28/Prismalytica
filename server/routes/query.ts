import express from 'express';
import { decrementUserDailyCreditBySignature, getUserAddressBySignature, getUserDailyCreditByAddress } from '../lib/userDb';

const router = express.Router();

interface QueryRequest {
  prompt: string;
  address: string;
  signature: string;
}

interface CdcAiAgentRequest {
  query: string;
  options: {
    openAI: {
      apiKey: string;
    };
    chainId: number;
    explorerKeys: {
      cronosZkEvmKey: string;
    };
  };
}

interface CdcAiAgentResponse {
  status: string;
  hasErrors: boolean;
  results: Array<{
    status: string;
    function: string;
    message: string;
    data: {
      blockHeight?: number;
      timestamp?: string;
      [key: string]: any;
    };
  }>;
  context: Array<{
    role: string;
    content: string;
  }>;
}

async function queryCdcAiAgent(query: string): Promise<CdcAiAgentResponse> {
  try {
    const url = 'https://ai-agent-api.crypto.com/api/v1/cdc-ai-agent-service/query';

    const requestBody: CdcAiAgentRequest = {
      query: query,
      options: {
        openAI: {
          apiKey: process.env.OPENIA || ''
        },
        chainId: 388,
        explorerKeys: {
          cronosZkEvmKey: process.env.CRONOSZKEMVKEY || ''
        }
      }
    };
    console.log('Querying CDC AI Agent:', requestBody);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json() as CdcAiAgentResponse;
  } catch (error) {
    console.error('Error querying CDC AI Agent:', error);
    throw error;
  }
}
// POST endpoint to handle queries
router.post('/', async (req: any, res: any) => {
  try {
    console.log(req)
    const { prompt, address, signature } = req.body as QueryRequest;

    // Validate request body
    if (!prompt || !address || !signature) {
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
    if (!credit || credit <= 0) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient daily credit. Please try again tomorrow.'
      });
    }
    // Process the query using CDC AI Agent
    try {
      const aiResponse = await queryCdcAiAgent(prompt);
      // console.log('AI Agent response:');
      // console.log(JSON.stringify(aiResponse, null, 2) + '\n');
      //console.log(aiResponse.results[0].message);

      await decrementUserDailyCreditBySignature(signature)
      return res.status(200).json({
        success: true,
        message: aiResponse.results[0].message,
        data: aiResponse.results[0].data
      });
    } catch (aiError) {
      console.error('AI Agent error:', aiError);
      return res.status(500).json({
        success: false,
        message: 'Error processing query with AI agent'
      });
    }
  } catch (error) {
    console.error('Error processing query:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;