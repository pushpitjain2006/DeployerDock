export const safelyParseJSON = (jsonString: string): any | null => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      return null;
    }
  };
  
  export const delay = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };