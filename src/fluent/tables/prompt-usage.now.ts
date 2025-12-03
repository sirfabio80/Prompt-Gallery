import '@servicenow/sdk/global';
import { Table, ReferenceColumn, StringColumn, DateTimeColumn } from '@servicenow/sdk/core';

// Prompt Usage table - tracks individual usage events of prompt versions
export const x_snc_prompt_galle_prompt_usage = Table({
  name: 'x_snc_prompt_galle_prompt_usage',
  label: 'Prompt Usage',
  display: 'display_value',
  extensible: false,
  audit: false, // Usage tracking doesn't need audit trail
  allow_web_service_access: true,
  accessible_from: 'public',
  actions: ['create', 'read', 'update', 'delete'],
  schema: {
    prompt_version: ReferenceColumn({
      label: 'Prompt Version',
      referenceTable: 'x_snc_prompt_galle_prompt_version',
      mandatory: true,
      cascadeRule: 'cascade'
    }),
    engagement: ReferenceColumn({
      label: 'Engagement',
      referenceTable: 'x_snc_prompt_galle_engagement',
      cascadeRule: 'clear'
    }),
    used_by: ReferenceColumn({
      label: 'Used By',
      referenceTable: 'sys_user',
      mandatory: true
    }),
    used_at: DateTimeColumn({
      label: 'Used At',
      mandatory: true,
      read_only: true
    }),
    context_description: StringColumn({
      label: 'Context Description',
      maxLength: 500
    }),
    tool_used: StringColumn({
      label: 'Tool Actually Used',
      dropdown: 'dropdown_with_none',
      choices: {
        general: { label: 'General', sequence: 0 },
        microsoft_copilot: { label: 'Microsoft Copilot', sequence: 1 },
        claude: { label: 'Claude', sequence: 2 },
        now_assist: { label: 'ServiceNow Now Assist', sequence: 3 },
        other: { label: 'Other', sequence: 4 }
      }
    }),
    display_value: StringColumn({
      label: 'Display Value',
      read_only: true,
      function_definition: 'glidefunction:concat(prompt_version.prompt.name, \' v\', prompt_version.version_number, \' by \', used_by.name)'
    })
  },
  index: [
    { name: 'idx_usage_version', element: 'prompt_version', unique: false },
    { name: 'idx_usage_user', element: 'used_by', unique: false },
    { name: 'idx_usage_date', element: 'used_at', unique: false },
    { name: 'idx_usage_engagement', element: 'engagement', unique: false }
  ]
});