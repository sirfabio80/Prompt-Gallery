import '@servicenow/sdk/global';
import { Table, ReferenceColumn, DateTimeColumn, StringColumn } from '@servicenow/sdk/core';

// Prompt Tag table - many-to-many relationship between Prompts and Tags
export const x_snc_prompt_galle_prompt_tag = Table({
  name: 'x_snc_prompt_galle_prompt_tag',
  label: 'Prompt Tag',
  display: 'display_value',
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
    tag: ReferenceColumn({
      label: 'Tag',
      referenceTable: 'x_snc_prompt_galle_tag',
      mandatory: true,
      cascadeRule: 'cascade'
    }),
    display_value: StringColumn({
      label: 'Display Value',
      read_only: true,
      function_definition: 'glidefunction:concat(prompt.name, \' - \', tag.name)'
    }),
    created_on: DateTimeColumn({
      label: 'Created On',
      read_only: true
    })
  },
  index: [
    { name: 'idx_prompt_tag_prompt', element: 'prompt', unique: false },
    { name: 'idx_prompt_tag_tag', element: 'tag', unique: false }
  ]
});