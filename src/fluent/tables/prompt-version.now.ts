import '@servicenow/sdk/global';
import { Table, StringColumn, ReferenceColumn, IntegerColumn, DateTimeColumn, DecimalColumn } from '@servicenow/sdk/core';

// Prompt Version table - contains actual prompt text and configurations
export const x_snc_prompt_galle_prompt_version = Table({
  name: 'x_snc_prompt_galle_prompt_version',
  label: 'Prompt Version',
  display: 'version_display',
  extensible: false,
  audit: true,
  allow_web_service_access: true,
  accessible_from: 'public',
  actions: ['create', 'read', 'update', 'delete'],
  schema: {
    prompt: ReferenceColumn({
      label: 'Prompt',
      referenceTable: 'x_snc_prompt_galle_prompt',
      mandatory: true,
      cascadeRule: 'cascade'
    }),
    version_number: IntegerColumn({
      label: 'Version Number',
      mandatory: true,
      min: 1
    }),
    status: StringColumn({
      label: 'Status',
      mandatory: true,
      dropdown: 'dropdown_with_none',
      default: 'draft',
      choices: {
        draft: { label: 'Draft', sequence: 0 },
        recommended: { label: 'Recommended', sequence: 1 },
        deprecated: { label: 'Deprecated', sequence: 2 }
      }
    }),
    target_tool: StringColumn({
      label: 'Target Tool',
      dropdown: 'dropdown_with_none',
      choices: {
        general: { label: 'General', sequence: 0 },
        microsoft_copilot: { label: 'Microsoft Copilot', sequence: 1 },
        claude: { label: 'Claude', sequence: 2 },
        now_assist: { label: 'ServiceNow Now Assist', sequence: 3 },
        other: { label: 'Other', sequence: 4 }
      }
    }),
    language: StringColumn({
      label: 'Language',
      maxLength: 5,
      default: 'en'
    }),
    role_instructions: StringColumn({
      label: 'Role / Instructions',
      maxLength: 4000
    }),
    prompt_body: StringColumn({
      label: 'Prompt Body',
      maxLength: 8000,
      mandatory: true
    }),
    example_input: StringColumn({
      label: 'Example Input',
      maxLength: 4000
    }),
    example_output: StringColumn({
      label: 'Example Output',
      maxLength: 4000
    }),
    rating_sum: IntegerColumn({
      label: 'Rating Sum',
      default: 0,
      read_only: true
    }),
    rating_count: IntegerColumn({
      label: 'Rating Count',
      default: 0,
      read_only: true
    }),
    usage_count: IntegerColumn({
      label: 'Usage Count',
      default: 0,
      read_only: true
    }),
    average_rating: DecimalColumn({
      label: 'Average Rating',
      read_only: true,
      function_definition: 'glidefunction:divide(rating_sum, rating_count)'
    }),
    version_display: StringColumn({
      label: 'Version Display',
      read_only: true,
      function_definition: 'glidefunction:concat(prompt.name, \' v\', version_number)'
    }),
    created_by: ReferenceColumn({
      label: 'Created By',
      referenceTable: 'sys_user',
      read_only: true
    }),
    created_on: DateTimeColumn({
      label: 'Created On',
      read_only: true
    }),
    updated_by: ReferenceColumn({
      label: 'Updated By',
      referenceTable: 'sys_user',
      read_only: true
    }),
    updated_on: DateTimeColumn({
      label: 'Updated On',
      read_only: true
    })
  },
  index: [
    { name: 'idx_version_prompt', element: 'prompt', unique: false },
    { name: 'idx_version_status', element: 'status', unique: false },
    { name: 'idx_version_tool', element: 'target_tool', unique: false },
    { name: 'idx_version_usage', element: 'usage_count', unique: false }
  ]
});