import os
import pandas as pd
import io
from crypto_com_agent_client import Agent, tool
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


from pydantic import BaseModel


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
EXPLORER_API_KEY = os.getenv("EXPLORER_API_KEY")
BASE_URL = os.getenv("BASE_URL")
BOT_TOKEN = os.getenv("BOT_TOKEN")


# Define a custom tool
@tool
def analyze_csv(csv_data: str, analysis_question: str = "Provide a general analysis") -> str:
    """
    Analyze CSV data and provide insights based on the analysis question.

    Args:
        csv_data (str): The CSV data as a string.
        analysis_question (str): Specific question or type of analysis to perform on the data.

    Returns:
        str: Analysis results and insights from the CSV data.
    """
    try:
        # Parse CSV data
        df = pd.read_csv(io.StringIO(csv_data))

        # Basic information about the data
        num_rows = len(df)
        num_cols = len(df.columns)
        columns = df.columns.tolist()

        # Generate basic statistics
        summary_stats = df.describe().to_string()

        # Prepare the analysis response
        analysis = f"CSV Analysis Results:\n"
        analysis += f"- Dataset contains {num_rows} rows and {num_cols} columns\n"
        analysis += f"- Columns: {', '.join(columns)}\n\n"
        analysis += f"Summary Statistics:\n{summary_stats}\n\n"
        analysis += f"Analysis for question: '{analysis_question}'\n"

        # Add specific insights based on the analysis_question
        # This is where the AI would normally provide custom analysis
        analysis += "Based on the data provided, here are some insights...\n"

        return analysis
    except Exception as e:
        return f"Error analyzing CSV data: {str(e)}"


# Initialize the agent
google_api_key = os.getenv("GOOGLE_API_KEY")
print("Google API Key:", google_api_key)
explorer_api_key = os.getenv("EXPLORER_API_KEY")
print("Explorer API Key:", explorer_api_key)
agent = Agent.init(
    llm_config={
       "provider": "GoogleGenAI",
       "model": "gemini-2.0-flash-lite",
       "provider-api-key": google_api_key
    },
    blockchain_config={
        "chainId": "388",
        "explorer-api-key": explorer_api_key,
    },
    plugins={
        "personality": {
            "tone": "friendly",
            "language": "English",
            "verbosity": "high",
        },
        "tools": [analyze_csv],
    },
)

class PromptRequest(BaseModel):
    prompt: str

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/llm")
async def llm_endpoint(request: PromptRequest):
    """
    Endpoint to interact with the agent using a prompt.
    Expects a JSON payload with a 'prompt' key.
    """
    try:
        # Validate that the prompt is not empty
        if not request.prompt.strip():
            raise HTTPException(
                status_code=400,
                detail="The prompt cannot be empty. Please provide a valid input."
            )
        # Retry logic for agent.interact
        retries = 5
        for attempt in range(retries):
            try:
                # Pass an integer thread_id in the interact call
                agent_response = agent.interact(request.prompt)
                if agent_response:
                    print("Agent response:", agent_response)
                    return {
                        "response": agent_response,
                        "status": "success"
                    }
            except Exception as e:
                if attempt == retries - 1:
                    raise HTTPException(
                        status_code=500,
                        detail="Agent failed to generate a response after multiple attempts. Please try again."
                    )

    except HTTPException as e:
        raise e  # Re-raise HTTP exceptions to preserve status codes
    except Exception as e:
        print("Error during agent interaction:", str(e))
        raise HTTPException(status_code=500, detail="An unexpected error occurred. Please try again.")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)