import '@servicenow/sdk/global';
import { Table, StringColumn, BooleanColumn, DateTimeColumn, ReferenceColumn } from '@servicenow/sdk/core';

// Tag table - reusable tags for categorizing prompts
export const x_snc_prompt_galle_tag = Table({
  name: 'x_snc_prompt_galle_tag',
  label: 'Tag',
  display: 'name',
  extensible: false,
  audit: true,
  allow_web_service_access: true,
  accessible_from: 'public',
  actions: ['create', 'read', 'update', 'delete'],
  schema: {
    name: StringColumn({
      label: 'Name',
      mandatory: true,
      maxLength: 50,
      attributes: {
        unique: true
      }
    }),
    tag_category: StringColumn({
      label: 'Tag Category',
      maxLength: 50
    }),
    description: StringColumn({
      label: 'Description',
      maxLength: 500
    }),
    is_active: BooleanColumn({
      label: 'Active',
      default: true
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
    { name: 'idx_tag_name', element: 'name', unique: true },
    { name: 'idx_tag_category', element: 'tag_category', unique: false },
    { name: 'idx_tag_active', element: 'is_active', unique: false }
  ]
});