import '@servicenow/sdk/global'
import { Table, StringColumn, DateColumn, DateTimeColumn, ReferenceColumn } from '@servicenow/sdk/core'

// Engagement table - optional table for tracking where prompts are used
export const x_snc_prompt_galle_engagement = Table({
    name: 'x_snc_prompt_galle_engagement',
    label: 'Engagement',
    display: 'name',
    extensible: false,
    audit: true,
    allowWebServiceAccess: true,
    accessibleFrom: 'public',
    actions: ['read', 'update', 'create'],
    schema: {
        name: StringColumn({
            label: 'Name',
            mandatory: true,
            maxLength: 100,
        }),
        customer_name: StringColumn({
            label: 'Customer Name',
            maxLength: 100,
        }),
        geo_region: StringColumn({
            label: 'GEO / Region',
            dropdown: 'dropdown_with_none',
            choices: {
                amer: { label: 'AMER', sequence: 0 },
                emea: { label: 'EMEA', sequence: 1 },
                apac: { label: 'APAC', sequence: 2 },
            },
        }),
        description: StringColumn({
            label: 'Description / Notes',
            maxLength: 4000,
        }),
        start_date: DateColumn({
            label: 'Start Date',
        }),
        end_date: DateColumn({
            label: 'End Date',
        }),
        created_by: ReferenceColumn({
            label: 'Created By',
            referenceTable: 'sys_user',
            readOnly: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        created_on: DateTimeColumn({
            label: 'Created On',
            readOnly: true,
        }),
        updated_by: ReferenceColumn({
            label: 'Updated By',
            referenceTable: 'sys_user',
            readOnly: true,
            attributes: {
                encode_utf8: false,
            },
        }),
        updated_on: DateTimeColumn({
            label: 'Updated On',
            readOnly: true,
        }),
    },
    index: [
        { name: 'index4', element: 'name', unique: false },
        { name: 'index2', element: 'customer_name', unique: false },
        { name: 'index3', element: 'geo_region', unique: false },
        {
            name: 'index',
            unique: false,
            element: 'created_by',
        },
        {
            name: 'index5',
            unique: false,
            element: 'updated_by',
        },
    ],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
})
