# AI Diet Planner

A mobile application that generates personalized diet plans powered by Azure OpenAI.

## Features

- User-friendly interface for diet planning
- Personalized meal recommendations based on user preferences
- AI-powered diet plan generation using Azure OpenAI
- Track daily meal consumption
- View and manage your personal profile

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- An Azure account with OpenAI access
- Azure OpenAI resource created with a deployed model

### Azure OpenAI Setup

1. Create an Azure OpenAI resource in the [Azure portal](https://portal.azure.com)
2. Deploy a model (recommended: GPT-4 or similar)
3. Get your API key and endpoint URL
4. Update the `.env` file with your Azure OpenAI credentials

### Environment Configuration

Create a `.env` file in the root directory with the following contents:

```
# Database configuration (if using)
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_SERVER=your_db_server
DB_NAME=your_db_name

# Azure OpenAI configuration
AZURE_OPENAI_API_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=your_model_deployment_name

# Server configuration
PORT=3000
```

Replace the placeholders with your actual Azure OpenAI credentials.

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

This will start both the backend server and the Expo development server.

### Mobile App

- Open the Expo Go app on your mobile device
- Scan the QR code displayed in the terminal
- Or run in a simulator with:

```bash
npm run ios
# or
npm run android
```

## Technology Stack

- React Native / Expo
- TypeScript
- Express (backend server)
- Azure OpenAI

## Architecture

The application uses a client-server architecture:

1. The React Native app serves as the client interface
2. Express.js backend proxies calls to Azure OpenAI
3. Azure OpenAI generates diet plans based on user data

This approach ensures API keys for Azure OpenAI are kept securely on the server side.
