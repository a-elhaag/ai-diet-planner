require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OpenAIClient } = require("@azure/openai");
const { AzureKeyCredential } = require("@azure/core-auth");
const sql = require("mssql");

const app = express();
app.use(cors());
app.use(express.json());

// Database config (commented out since we don't have a DB yet)
/*
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};
*/

// Azure OpenAI Configuration
const azureOpenaiKey = process.env.AZURE_OPENAI_API_KEY;
const azureOpenaiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
const azureOpenaiDeploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

// Create the OpenAI client
const openaiClient = new OpenAIClient(
  azureOpenaiEndpoint,
  new AzureKeyCredential(azureOpenaiKey)
);

// Existing endpoint - commented out for now as we don't have a DB set up
app.get("/users", async (req, res) => {
  try {
    // Mock response until database is set up
    res.json([
      { id: 1, name: "Demo User", email: "demo@example.com" }
    ]);
    
    // Uncomment when database is set up
    // await sql.connect(dbConfig);
    // const result = await sql.query`SELECT * FROM Users`; // Replace with your actual table
    // res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "AI Diet Planner API is running" });
});

// Diet Plan Generation Endpoint
app.post("/api/generate-diet-plan", async (req, res) => {
  try {
    const { user, preferences } = req.body;

    if (!user) {
      return res.status(400).json({ error: "User data is required" });
    }

    // Construct the prompt for the AI
    const prompt = constructDietPlanPrompt(user, preferences);

    // Call Azure OpenAI
    const response = await openaiClient.getChatCompletions(
      azureOpenaiDeploymentName,
      [
        { role: "system", content: "You are a nutrition expert creating personalized meal plans." },
        { role: "user", content: prompt }
      ],
      {
        temperature: 0.7,
        maxTokens: 1500,
      }
    );

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No response from Azure OpenAI");
    }

    // Process the response into a structured diet plan
    const dietPlan = processDietPlanResponse(response.choices[0].message.content);

    // Return the diet plan
    res.status(200).json({ dietPlan });
  } catch (error) {
    console.error("Error generating diet plan:", error);
    res.status(500).json({ 
      error: "Failed to generate diet plan", 
      message: error.message 
    });
  }
});

// Function to construct the prompt for diet plan generation
function constructDietPlanPrompt(user, preferences = {}) {
  const { name, age, weight, height, goal, activityLevel, dietaryRestrictions } = user;

  return `Create a personalized daily diet plan for ${name}, who is ${age} years old. 
Their current weight is ${weight} kg and height is ${height} cm. 
Their fitness goal is: ${goal}.
Activity level: ${activityLevel}.
Dietary restrictions: ${dietaryRestrictions.join(", ")}.

${preferences?.extraNotes ? "Additional notes: " + preferences.extraNotes : ""}

Create a detailed meal plan including breakfast, lunch, dinner, and two snacks.
For each meal, provide:
1. Name of the dish
2. List of ingredients with approximate measurements
3. Brief preparation instructions
4. Approximate calories and macronutrients (protein, carbs, fats)

The meals should be nutritionally balanced, support the stated goal, and respect all dietary restrictions.
Format the response as a structured JSON object.`;
}

// Function to process the AI response into a structured format
function processDietPlanResponse(responseText) {
  try {
    // Try to parse the response as JSON
    const cleanedResponse = responseText.trim();
    
    // Handle cases where the AI might include markdown code block syntax
    const jsonContent = cleanedResponse.replace(/```json|```/g, "").trim();
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    
    // If parsing fails, return the raw text
    return {
      rawResponse: responseText,
      error: "Could not parse response as structured data"
    };
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AI Diet Planner API is running on http://localhost:${PORT}`);
});
