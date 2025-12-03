import '@servicenow/sdk/global';
import { Table, StringColumn, DateColumn, DateTimeColumn, ReferenceColumn } from '@servicenow/sdk/core';

// Engagement table - optional table for tracking where prompts are used
export const x_snc_prompt_galle_engagement = Table({
  name: 'x_snc_prompt_galle_engagement',
  label: 'Engagement',
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
      maxLength: 100
    }),
    customer_name: StringColumn({
      label: 'Customer Name',
      maxLength: 100
    }),
    geo_region: StringColumn({
      label: 'GEO / Region',
      dropdown: 'dropdown_with_none',
      choices: {
        amer: { label: 'AMER', sequence: 0 },
        emea: { label: 'EMEA', sequence: 1 },
        apac: { label: 'APAC', sequence: 2 }
      }
    }),
    description: StringColumn({
      label: 'Description / Notes',
      maxLength: 4000
    }),
    start_date: DateColumn({
      label: 'Start Date'
    }),
    end_date: DateColumn({
      label: 'End Date'
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
    { name: 'idx_engagement_name', element: 'name', unique: false },
    { name: 'idx_engagement_customer', element: 'customer_name', unique: false },
    { name: 'idx_engagement_region', element: 'geo_region', unique: false }
  ]
});