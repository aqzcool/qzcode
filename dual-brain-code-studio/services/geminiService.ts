import { GoogleGenAI, Type } from "@google/genai";
import { Message, Role } from "../types";

const apiKey = process.env.API_KEY || 'dummy-key-for-demo'; 

const ai = new GoogleGenAI({ apiKey });

// Define the response schema for the Architect
const architectSchema = {
  type: Type.OBJECT,
  properties: {
    chat_response: { type: Type.STRING },
    plan_overview: { type: Type.STRING },
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          file_name: { type: Type.STRING }
        },
        required: ['title', 'description', 'file_name']
      }
    }
  },
  required: ['chat_response', 'plan_overview', 'tasks']
};

export interface ArchitectOutput {
  chat_response: string;
  plan_overview: string;
  tasks: {
    title: string;
    description: string;
    file_name: string;
  }[];
}

export const generateArchitectPlan = async (
  currentPrompt: string, 
  history: Message[]
): Promise<ArchitectOutput> => {
  try {
    // Convert internal message format to Gemini format
    const contents = history.map(msg => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add current user prompt if it's not already in history (it should be managed by caller, but safe to check)
    // For this implementation, we assume 'history' contains the PAST, and we append the new prompt.
    // However, the caller usually appends the user message to state before calling. 
    // We will trust 'history' includes the latest user message or we send it as the prompt if history is empty.
    
    let fullContents = contents;
    if (fullContents.length === 0 || fullContents[fullContents.length-1].role !== 'user') {
        fullContents.push({ role: 'user', parts: [{ text: currentPrompt }]});
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullContents,
      config: {
        responseMimeType: "application/json",
        responseSchema: architectSchema,
        systemInstruction: `You are a Senior Software Architect. 
        Analyze the user's request.
        
        GOAL:
        1. Engage in a conversation with the user to clarify requirements or explain your decisions.
        2. Break the request down into distinct, parallel technical tasks/components (files).
        3. If this is a follow-up request, UPDATE the task list to reflect the new requirements (add new files, modify descriptions).
        4. ALWAYS return the COMPLETE list of tasks needed for the project, even if some haven't changed.
        
        IMPORTANT: Provide the 'file_name' as a full relative path including directories.
        Always use standard React folder structure (e.g., 'src/components/', 'src/hooks/', 'src/utils/').
        
        Example output format:
        {
          "chat_response": "I've added the Navbar and Blog list as requested. I think we should also...",
          "plan_overview": "Technical approach involves a shared layout and dynamic routing.",
          "tasks": [
            { "title": "Navbar Component", "description": "Create a responsive navigation bar.", "file_name": "src/components/Navbar.tsx" },
            { "title": "Blog List", "description": "Fetch and display grid.", "file_name": "src/pages/BlogList.tsx" }
          ]
        }`
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    return JSON.parse(text) as ArchitectOutput;

  } catch (error) {
    console.error("Architect Error:", error);
    return {
      chat_response: "I'm having trouble connecting to the design matrix. I'll attempt a manual override.",
      plan_overview: "Fallback plan active.",
      tasks: [
        { title: "Main Layout", description: "Setup the main layout.", file_name: "src/layouts/Layout.tsx" }
      ]
    };
  }
};

export interface CoderResponse {
  code: string;
  explanation: string;
}

export const chatWithCoder = async (
  taskTitle: string, 
  fileName: string,
  currentCode: string,
  history: Message[]
): Promise<CoderResponse> => {
  try {
    // Convert internal message format to Gemini format
    const contents = history.map(msg => ({
      role: msg.role === Role.USER || msg.role === Role.ARCHITECT ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: `You are an Expert React/TypeScript Developer assigned to write the file: '${fileName}'.
        
        YOUR GOAL: Implement or Update the code based on the user's latest request and the conversation history.
        
        CONTEXT:
        - Current File Content:
        \`\`\`typescript
        ${currentCode || '// New file'}
        \`\`\`
        
        OUTPUT RULES:
        1. You MUST provide the FULL content of the file in a single markdown code block (e.g., \`\`\`tsx ... \`\`\`).
        2. Outside the code block, provide a brief, friendly explanation of what you changed or built.
        3. Do not omit code for brevity (e.g., "rest of code same"). Write the full file.
        `
      }
    });

    const text = response.text || "";
    
    // Extract code block
    const codeMatch = text.match(/```(?:tsx|ts|javascript|js|css|json)?\n([\s\S]*?)```/);
    let code = currentCode;
    let explanation = text;

    if (codeMatch && codeMatch[1]) {
      code = codeMatch[1].trim();
      // Remove the code block from the explanation to keep chat clean
      explanation = text.replace(/```(?:tsx|ts|javascript|js|css|json)?\n[\s\S]*?```/, '[Code Updated]').trim();
    }

    return { code, explanation };

  } catch (error) {
    console.error("Coder Error:", error);
    return {
      code: currentCode,
      explanation: "I encountered an error while trying to generate the code. Please try again."
    };
  }
};
