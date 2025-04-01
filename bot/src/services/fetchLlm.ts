interface LLMResponse {
    response: string;
}

export async function fetchLlm(prompt: string, csvData: string): Promise<string> {
    prompt = `${csvData.replace(/\n/g, ' ')},${prompt.replace(/\n/g, ' ')}`.replace(/\s+/g, ' ').trim();
    try {
        const response = await fetch(`${process.env.LLM_URL}/llm`, { // Use Docker service name for communication
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        console.log(`LLM server response status: ${response.status}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Error from LLM: ${response.status} - ${response.statusText}. Response: ${errorText}`);
            throw new Error(`Failed to fetch LLM response: ${response.statusText}`);
        }

        const json = await response.json() as LLMResponse;
        console.log(`Received response from LLM: ${json.response}`);
        return json.response;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in fetchLlm:', error.message);
            throw new Error(`Error fetching LLM response: ${error.message}`);
        } else {
            console.error('Unknown error in fetchLlm:', error);
            throw new Error('An unknown error occurred while fetching LLM response.');
        }
    }
}