import os

import openai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Azure OpenAI config (using openai Python SDK)
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
key = os.getenv("AZURE_OPENAI_API_KEY")
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

# Configure OpenAI client for Azure
openai.api_type = "azure"
openai.api_base = endpoint
openai.api_version = "2023-05-15"  # use your model's api-version
openai.api_key = key


@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "AI Diet Planner API is running"}


@app.post("/api/generate-diet-plan")
def generate_diet_plan(payload: dict):
    user = payload.get("user")
    prefs = payload.get("preferences", {})
    if not user:
        raise HTTPException(status_code=400, detail="User data is required")

    prompt = construct_prompt(user, prefs)
    try:
        response = openai.ChatCompletion.create(
            engine=deployment,
            messages=[
                {
                    "role": "system",
                    "content": "You are a nutrition expert creating personalized meal plans.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=1500,
        )
        choice = response.choices[0].message.content
        plan = parse_response(choice)
        return {"dietPlan": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def construct_prompt(user, prefs):
    name = user.get("name")
    age = user.get("age")
    weight = user.get("weight")
    height = user.get("height")
    goal = user.get("goal")
    activity = user.get("activityLevel")
    restrictions = ", ".join(user.get("dietaryRestrictions", []))
    extra = prefs.get("extraNotes", "")
    return f"Create a personalized daily diet plan for {name}, who is {age} years old. Current weight {weight} kg, height {height} cm. Goal: {goal}. Activity level: {activity}. Dietary restrictions: {restrictions}. {('Additional notes: ' + extra) if extra else ''}"


def parse_response(text: str):
    import json

    cleaned = text.strip().replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(cleaned)
    except:
        return {"rawResponse": text}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=3000, reload=True)
