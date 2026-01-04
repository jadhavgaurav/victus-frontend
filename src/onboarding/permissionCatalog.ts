export interface PermissionItem {
    id: string; // scope key
    label: string;
    description: string;
    risk: 'low' | 'medium' | 'high';
    defaultEnabled: boolean;
    category: 'starter' | 'advanced';
    requiresConfirmationDefault: boolean;
}

export const PERMISSION_CATALOG: PermissionItem[] = [
    // Safe Starter
    {
        id: 'tool.web.fetch',
        label: 'Web Browsing',
        description: 'Allow agent to read verify public webpages (Read-only).',
        risk: 'low',
        defaultEnabled: false, // Strict default as per security requirement, though "Safe Starter" implies user can turn it on
        category: 'starter',
        requiresConfirmationDefault: false
    },
    {
        id: 'tool.weather.get',
        label: 'Weather Lookup',
        description: 'Check current weather conditions.',
        risk: 'low',
        defaultEnabled: true,
        category: 'starter',
        requiresConfirmationDefault: false
    },
    
    // Advanced / High Risk
    {
        id: 'tool.email.send',
        label: 'Send Emails',
        description: 'Compose and send emails on your behalf.',
        risk: 'high',
        defaultEnabled: false,
        category: 'advanced',
        requiresConfirmationDefault: true
    },
    {
        id: 'tool.calendar.create',
        label: 'Manage Calendar',
        description: 'Create and modify calendar events.',
        risk: 'medium',
        defaultEnabled: false,
        category: 'advanced',
        requiresConfirmationDefault: true
    },
    {
        id: 'tool.files.read',
        label: 'Read Files',
        description: 'Read content from your local documents.',
        risk: 'medium',
        defaultEnabled: false,
        category: 'advanced',
        requiresConfirmationDefault: true
    },
    {
        id: 'tool.files.write',
        label: 'Write Files',
        description: 'Create or edit files (High Risk).',
        risk: 'high',
        defaultEnabled: false,
        category: 'advanced',
        requiresConfirmationDefault: true
    }
];
