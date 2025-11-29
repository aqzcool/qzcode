
export enum Role {
  USER = 'user',
  ARCHITECT = 'model-architect',
  CODER = 'model-coder',
  SYSTEM = 'system',
}

export type AgentRole = 'visualist' | 'builder' | 'logician' | 'architect' | 'git-keeper' | 'qa-core';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  color: string;
  status: 'idle' | 'working' | 'online' | 'error';
  isPlugin?: boolean; // If it's an external tool like Git or QA
}

export interface Message {
  id: string;
  role: Role;
  senderName?: string; 
  senderType?: 'agent' | 'user' | 'system';
  content: string;
  timestamp: number;
  channelId: string; // Which channel does this belong to
}

// A Channel can be a direct chat with a File, the Architect, or a Group
export interface Channel {
  id: string;
  type: 'special' | 'file' | 'group';
  name: string;
  description?: string;
  agentId?: string; // If linked to a specific agent
  unreadCount?: number;
  status?: 'idle' | 'working' | 'online';
}

export type TaskStatus = 'idle' | 'pending' | 'running' | 'completed' | 'error';

export interface Task {
  id: string;
  title: string;
  description: string;
  file_name?: string; 
  status: TaskStatus;
  code: string;
  assignedAgentId?: string; 
  // Note: 'messages' are now stored centrally in GenerationState.messages filtered by channelId
}

export interface GenerationState {
  isGenerating: boolean;
  currentStep: 'idle' | 'architecting' | 'coding' | 'complete';
  architectThinking: string;
  
  messages: Message[]; // All messages in the system
  channels: Channel[]; // List of all chatable entities
  activeChannelId: string; // Currently viewing this chat
  
  activeAgents: Agent[];
  tasks: Task[];
  activeTaskId: string | null; // Currently editing/previewing this file
  error?: string;
}
