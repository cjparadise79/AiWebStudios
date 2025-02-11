import OpenAI from 'openai';

function getOpenAIInstance() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found. Please add your API key to the .env file.');
  }

  try {
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
    throw new Error('Failed to initialize OpenAI client. Please check your API key.');
  }
}

// Initialize OpenAI client
let openai: OpenAI | null = null;
try {
  openai = getOpenAIInstance();
} catch (error) {
  if (error instanceof Error) {
    console.error('Failed to initialize OpenAI:', error.message);
  } else {
    console.error('Failed to initialize OpenAI:', error);
  }
}

export type WebsiteComponent = {
  type: string;
  props: Record<string, any>;
  children?: WebsiteComponent[];
};

function handleOpenAIError(error: any): string {
  if (error?.status === 429) {
    return "The AI service is currently at capacity. Please try again in a few minutes, or contact support to upgrade your API quota.";
  }
  return error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
}

export async function generateWebsiteCode(prompt: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI client is not initialized. Please check your API key configuration in the .env file.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert web developer specializing in React and Tailwind CSS. 
          Generate clean, modern, and responsive website code based on user descriptions.
          Only respond with the complete React component code, no explanations.
          Use Tailwind CSS for styling and ensure the design is professional and beautiful.
          Include proper TypeScript types and React hooks where necessary.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    if (!response.choices[0].message.content) {
      throw new Error('No response received from OpenAI');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating website code:', error);
    throw new Error(handleOpenAIError(error));
  }
}

export async function analyzeUserPrompt(prompt: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI client is not initialized. Please check your API key configuration in the .env file.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI website design consultant. 
          Analyze user requests and provide helpful guidance about website design and features.
          Keep responses concise, professional, and focused on web development.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    if (!response.choices[0].message.content) {
      throw new Error('No response received from OpenAI');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    throw new Error(handleOpenAIError(error));
  }
}