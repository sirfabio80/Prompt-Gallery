import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    BooleanColumn,
    ReferenceColumn,
    DateTimeColumn,
    IntegerColumn,
    GenericColumn,
} from '@servicenow/sdk/core'

// Main Prompt table - represents conceptual prompts that can have multiple versions
export const x_snc_prompt_galle_prompt = Table({
    name: 'x_snc_prompt_galle_prompt',
    label: 'Prompt',
    display: 'name',
    extensible: false,
    audit: true,
    allowWebServiceAccess: true,
    accessibleFrom: 'public',
    actions: ['read', 'update', 'delete', 'create'],
    schema: {
        name: StringColumn({
            label: 'Name',
            mandatory: true,
            maxLength: 100,
            attributes: {
                unique: true,
            },
        }),
        short_description: StringColumn({
            label: 'Short Description',
            maxLength: 1000,
        }),
        full_prompt: GenericColumn({
            label: 'Full Prompt',
            maxLength: 65000,
            mandatory: true,
            attributes: {
                internal_type: 'html', // HTML data type with rich text support
            },
            columnType: 'html',
        }),
        category: ReferenceColumn({
            label: 'Category',
            referenceTable: 'x_snc_prompt_galle_category',
            mandatory: true,
            default: '65f6bd55c594448aa244e06a21666071',
            choices: {
                design: {
                    label: 'Design',
                    sequence: 1,
                },
                communication: {
                    label: 'Communication / Email',
                    sequence: 5,
                },
                solution_architecture: {
                    label: 'Solution Architecture',
                    sequence: 2,
                },
                demo_script: {
                    label: 'Demo Script',
                    sequence: 6,
                },
                implementation: {
                    label: 'Implementation',
                    sequence: 3,
                },
                internal_productivity: {
                    label: 'Internal Productivity',
                    sequence: 7,
                },
                documentation: {
                    label: 'Documentation',
                    sequence: 4,
                },
                discovery: {
                    label: 'Discovery',
                    sequence: 0,
                },
            },
            dropdown: 'dropdown_without_none',
            maxLength: 40,
        }),
        owner_team: ReferenceColumn({
            label: 'Owner Team',
            referenceTable: 'sys_user_group',
            attributes: {
                encode_utf8: false,
            },
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
        // Computed fields for quick access
        latest_version_number: IntegerColumn({
            label: 'Latest Version',
            readOnly: true,
            default: 0,
        }),
        total_usage_count: IntegerColumn({
            label: 'Total Usage Count',
            readOnly: true,
            default: 0,
        }),
    },
    index: [
        { name: 'index4', element: 'name', unique: true },
        { name: 'index', element: 'category', unique: false },
        { name: 'index3', element: 'is_active', unique: false },
        {
            name: 'index2',
            unique: false,
            element: 'created_by',
        },
        {
            name: 'index5',
            unique: false,
            element: 'owner_team',
        },
        {
            name: 'index6',
            unique: false,
            element: 'updated_by',
        },
    ],
})
