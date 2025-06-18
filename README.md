# DeployerDock V1: Git Website Builder and Deployer

This project automates the deployment process for websites hosted on Git. It takes a Git repository URL as input, deploys the website, and provides the deployed website's ID and URL in the format `https://id.localhost:3001`.

## Prerequisites

- Node.js and npm (or yarn) installed on your system.
- AWS account with SQS and S3 services enabled.

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/pushpitjain2006/DeployerDock.git
   ```

2. Navigate to the project directory:

   ```bash
   cd DeployerDock
   ```

## Running the Project

The project consists of four separate services: deploy-service, upload-service, request-handler, and frontend. You need to start them in a specific order for the deployment process to function correctly.

Before starting each service add your credentials in the .env file as per the requirements.

1. **Start the Deploy Service:**

   ```bash
   cd deploy-service
   cp .env.example .env
   ```
   Complete the fields in .env file
   ```bash
   npm install
   npm run build
   node dist/index.cjs
   ```

   This service handles the core deployment logic.

2. **Start the Upload Service:**

   ```bash
   cd upload-service
   cp .env.example .env
   ```
   Complete the fields in .env file
   ```bash
   npm install
   npm run build
   node dist/app.cjs
   ```

   This service is responsible for handling frontend requests and uploading URL to the deployment queue (AWS SQS).

3. **Start the Request Handler:**

   ```bash
   cd request-handler
   cp .env.example .env
   ```
   Complete the fields in .env file
   ```bash
   npm install
   npm run build
   node dist/index.cjs
   ```

   This service handles incoming requests for website deployment and interacts with other services.

4. **Start the Frontend:** (Optional, if you have a user interface)

   ```bash
   cd frontend
   cp .env.example .env
   ```
   Complete the fields in .env file
   ```bash
   npm install
   npm run dev
   ```

   This service provides a user interface for interacting with the deployment process (if implemented).
   (You can alternatively build the frontend and serve it using a static file server.)

## Usage

Once all services are running, navigate to the frontend at `http://localhost:5173/`. Here, you can deploy a website by providing its Git repository URL and the base path for the frontend in your repository. Currently, the project supports only frontend projects that use ```npm run build``` for building (e.g., React, Angular, Vue, etc.).

## Deployment Output

Upon successful deployment, the project will return the following information:

- **Deployed Website ID:** A unique identifier assigned to the deployed website by the hosting platform.
- **Deployed Website URL:** The URL of the deployed website. Example: `https://id.localhost:3001`.
