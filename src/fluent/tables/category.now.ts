import '@servicenow/sdk/global'
import { Table, StringColumn, BooleanColumn, IntegerColumn } from '@servicenow/sdk/core'

// Category table for Prompt Gallery - replaces sys_choice dependency
export const x_snc_prompt_galle_category = Table({
    name: 'x_snc_prompt_galle_category',
    label: 'Prompt Category',
    display: 'display_name',
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
            attributes: {
                unique: true,
            },
        }),
        display_name: StringColumn({
            label: 'Display Name',
            mandatory: true,
            maxLength: 100,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 1000,
        }),
        icon: StringColumn({
            label: 'Icon',
            maxLength: 50,
            default: 'folder-o',
        }),
        color: StringColumn({
            label: 'Color',
            maxLength: 20,
            default: '#0073e6',
        }),
        sequence: IntegerColumn({
            label: 'Sequence',
            default: 100,
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true,
        }),
        prompt_count: IntegerColumn({
            label: 'Prompt Count',
            readOnly: true,
            default: 0,
        }),
    },
    index: [
        { name: 'index2', element: 'name', unique: true },
        { name: 'index3', element: 'sequence', unique: false },
        { name: 'index', element: 'is_active', unique: false },
    ],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
})
