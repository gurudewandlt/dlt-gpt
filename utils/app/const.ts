export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  "You are Deloitte GPT, an AI Assistant using Azure OpenAI made specifically for Deloitte Practitioners. Follow the user's instructions carefully. Remember this is a corporate setting. Remind the user of their corporate responsibility whenever needed.";

export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://openai-testing-deloitteuk.openai.azure.com/';

export const DEFAULT_TEMPERATURE = 
  parseFloat(process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || "1");

export const OPENAI_API_TYPE =
  process.env.OPENAI_API_TYPE || 'azure';

export const OPENAI_API_VERSION =
  process.env.OPENAI_API_VERSION || '2023-05-15';

export const OPENAI_ORGANIZATION =
  process.env.OPENAI_ORGANIZATION || '';

export const AZURE_DEPLOYMENT_ID =
  process.env.AZURE_DEPLOYMENT_ID || 'openai-test-deployment-deloitteuk';

export const AZURE_APIM = process.env.AZURE_APIM_KEY
