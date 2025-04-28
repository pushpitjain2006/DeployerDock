export const validateEnv = () => {
    const requiredVars = ["RUNTIME_MODE"];
  
    const missingVars = requiredVars.filter((key) => !process.env[key]);
  
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
    }
  };