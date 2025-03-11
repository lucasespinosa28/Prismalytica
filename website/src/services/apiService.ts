// API service for handling backend communication

import { useCandleStore } from "../store/candleStore";

/**
 * Handles user queries by routing to the appropriate API endpoint based on whether
 * price chart analysis is needed
 * @param prompt The user's message
 * @param address The user's wallet address
 * @param signature The signature verifying wallet ownership
 * @param showPriceChart Whether to include price chart analysis
 * @returns The AI response
 */
export const handleUserQuery = async (
  prompt: string,
  address: `0x${string}`,
  signature: string | undefined,
  showPriceChart: boolean = false
): Promise<{
  success: boolean,
  message: string;
  magicLink?: string | null;
}> => {
  if (showPriceChart) {
    return sendAnalysisRequest(prompt, address, signature);
  } else {
    return sendQueryToAI(prompt, address, signature);
  }
};

/**
 * Sends a query to the AI service
 * @param prompt The user's message
 * @param address The user's wallet address
 * @param signature The signature verifying wallet ownership
 * @returns The AI response
 */
export const sendQueryToAI = async (
  prompt: string,
  address: `0x${string}`,
  signature: string | undefined
): Promise<{
  success: boolean,
  message: string;
  magicLink?: string | null;
}> => {
  if (!signature) {
    throw new Error("Signature is required");
  }
  const response = await fetch('https://server-shy-feather-7870.fly.dev/api/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      address,
      signature,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const result = await response.json();
  const  magicLink: string | null | undefined = result.data.magicLink;
   let markdown:string = result.message
   if(magicLink){
    console.log({magicLink})
    //
    // http://localhost:5174//sign-transaction/16781bfc-06a3-4f2d-a455-12c1a5e5fc53?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cmFuc2FjdGlvbklkIjoiMTY3ODFiZmMtMDZhMy00ZjJkLWE0NTUtMTJjMWE1ZTVmYzUzIiwidG8iOiIweDU4M0Q5OGM2RkE3OTNCOWVGRjgwNjc0RjlEY2ExQkJjN2NjNkY5RjIiLCJhbW91bnQiOjEsInN5bWJvbCI6IlRDUk8iLCJjaGFpbiI6Mzg4LCJleHAiOjE3NDE2NTc1OTIsImlhdCI6MTc0MTY1Njk5Mn0.f06mH8k9avHiF7btWA6WnVdPglDsyIkaSDkgvkIl8WQ"
    const link = magicLink.replace("www.your-domain.com/","cdc-ai-agent-signer-app.pages.dev/")
    //https://cdc-ai-agent-signer-app.pages.dev/
    //https://www.your-domain.com/
    markdown += `\n\n**[link to sign](${link})**\n`;
   }
  return {
    success: result.success,
    message: markdown,
  };
};

export const sendAnalysisRequest = async (
  customPrompt: string,
  address: `0x${string}`,
  signature: string | undefined,
): Promise<{
  success: boolean,
  message: string;
  magicLink?: string | null;
}> => {
  if (!signature) {
    throw new Error("Signature is required");
  }
  console.log("sendAnalysisRequest");
  // Access the store state directly without using the hook
  const data = useCandleStore.getState().candle;

  const response = await fetch('https://server-shy-feather-7870.fly.dev/api/analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customPrompt,
      address,
      signature,
      data,
    }),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
  const result = await response.json();
  return {
    success: true,
    message: result.analysis.content,
  };
};