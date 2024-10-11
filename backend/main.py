from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import openai
from dotenv import load_dotenv
import os
import logging

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    logger.error("OpenAI API key is not set.")
    raise ValueError("OpenAI API key is not set.")

@app.post("/api/chat")
async def chat(
    message: str = Form(...),  # Use Form to extract message
    model: str = Form("gpt-4"),  # Use Form to extract model
    file: UploadFile = File(None)
):
    try:
        logger.info("Received message: %s with model: %s", message, model)
        
        # Validate the model
        valid_models = ["gpt-3.5-turbo", "gpt-4", "gpt-4-32k", "gpt-4-turbo", "davinci", "curie", "claude"]
        if model not in valid_models:
            raise HTTPException(status_code=400, detail="Invalid model specified.")

        # Handle the uploaded file if needed
        if file:
            logger.info("Received file: %s", file.filename)
            # You can implement file processing logic here

        response = openai.ChatCompletion.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": message}
            ]
        )
        return {"message": response.choices[0].message.content}
    except openai.error.OpenAIError as e:
        logger.error("OpenAI API error: %s", str(e))
        raise HTTPException(status_code=500, detail="Error communicating with OpenAI API.")
    except Exception as e:
        logger.error("Unexpected error: %s", str(e))
        raise HTTPException(status_code=500, detail="An unexpected error occurred.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
