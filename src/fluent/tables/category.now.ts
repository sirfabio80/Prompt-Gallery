import '@servicenow/sdk/global';
import { Table, StringColumn, BooleanColumn, IntegerColumn } from '@servicenow/sdk/core';

// Category table for Prompt Gallery - replaces sys_choice dependency
export const x_snc_prompt_galle_category = Table({
  name: 'x_snc_prompt_galle_category',
  label: 'Prompt Category',
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
      maxLength: 100,
      attributes: {
        unique: true
      }
    }),
    display_name: StringColumn({
      label: 'Display Name',
      mandatory: true,
      maxLength: 100
    }),
    description: StringColumn({
      label: 'Description',
      maxLength: 1000
    }),
    icon: StringColumn({
      label: 'Icon',
      maxLength: 50,
      default: 'folder-o'
    }),
    color: StringColumn({
      label: 'Color',
      maxLength: 20,
      default: '#0073e6'
    }),
    sequence: IntegerColumn({
      label: 'Sequence',
      default: 100
    }),
    is_active: BooleanColumn({
      label: 'Active',
      default: true
    }),
    prompt_count: IntegerColumn({
      label: 'Prompt Count',
      read_only: true,
      default: 0
    })
  },
  index: [
    { name: 'idx_category_name', element: 'name', unique: true },
    { name: 'idx_category_sequence', element: 'sequence', unique: false },
    { name: 'idx_category_active', element: 'is_active', unique: false }
  ]
});