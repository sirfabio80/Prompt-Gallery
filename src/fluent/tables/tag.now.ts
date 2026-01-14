import '@servicenow/sdk/global'
import { Table, StringColumn, BooleanColumn, DateTimeColumn, ReferenceColumn } from '@servicenow/sdk/core'

// Tag table - reusable tags for categorizing prompts
export const x_snc_prompt_galle_tag = Table({
    name: 'x_snc_prompt_galle_tag',
    label: 'Tag',
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
            maxLength: 50,
            attributes: {
                unique: true,
            },
        }),
        tag_category: StringColumn({
            label: 'Tag Category',
            maxLength: 50,
        }),
        description: StringColumn({
            label: 'Description',
            maxLength: 500,
        }),
        is_active: BooleanColumn({
            label: 'Active',
            default: true,
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
        { name: 'index3', element: 'name', unique: true },
        { name: 'index4', element: 'tag_category', unique: false },
        { name: 'index2', element: 'is_active', unique: false },
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
