
export interface ToolDefinition {
  id: string; // The scope key, e.g., 'tool.email.send'
  name: string;
  description: string;
  category: 'communications' | 'calendar' | 'files' | 'web' | 'system';
  riskLevel: 'low' | 'medium' | 'high';
}

export const toolCatalog: ToolDefinition[] = [
  // Communications
  {
    id: 'tool.email.send',
    name: 'Send Emails',
    description: 'Compose and send emails on your behalf.',
    category: 'communications',
    riskLevel: 'high',
  },
  {
    id: 'tool.email.read',
    name: 'Read Emails',
    description: 'Read and search your email inbox.',
    category: 'communications',
    riskLevel: 'medium',
  },

  // Calendar
  {
    id: 'tool.calendar.create',
    name: 'Manage Calendar',
    description: 'Create, update, and delete calendar events.',
    category: 'calendar',
    riskLevel: 'medium',
  },
  {
    id: 'tool.calendar.read',
    name: 'Read Calendar',
    description: 'View your upcoming schedule and free/busy time.',
    category: 'calendar',
    riskLevel: 'low',
  },

  // Files
  {
    id: 'tool.files.read',
    name: 'Read Files',
    description: 'Read contents of files in your workspace.',
    category: 'files',
    riskLevel: 'medium',
  },
  {
    id: 'tool.files.write',
    name: 'Write Files',
    description: 'Create or modify files in your workspace.',
    category: 'files',
    riskLevel: 'high',
  },

  // Web
  {
    id: 'tool.web.search',
    name: 'Web Search',
    description: 'Search the internet for public information.',
    category: 'web',
    riskLevel: 'low',
  },
  {
    id: 'tool.web.fetch',
    name: 'Browse Pages',
    description: 'Visit and read content from specific URLs.',
    category: 'web',
    riskLevel: 'medium',
  },

  // System
  {
    id: 'tool.system.rag',
    name: 'Knowledge Base',
    description: 'Access the internal vector database for long-term memory.',
    category: 'system',
    riskLevel: 'low',
  },
];

export const categoryLabels: Record<string, string> = {
  communications: 'Communications',
  calendar: 'Calendar & Scheduling',
  files: 'Filesystem Access',
  web: 'Internet & Browsing',
  system: 'System & Automation',
};
