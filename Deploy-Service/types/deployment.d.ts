export interface DeploymentData {
    repoId: string;
    repoUrl: string;
    repoBase?: string;
  }
  
  export interface SQSEventRecord {
    body: string;
  }
  
  export interface SQSEvent {
    Records: SQSEventRecord[];
  }