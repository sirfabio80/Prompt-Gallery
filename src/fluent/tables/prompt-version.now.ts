import '@servicenow/sdk/global'
import {
    Table,
    StringColumn,
    ReferenceColumn,
    IntegerColumn,
    DateTimeColumn,
    DecimalColumn,
} from '@servicenow/sdk/core'

// Prompt Version table - contains actual prompt text and configurations
export const x_snc_prompt_galle_prompt_version = Table({
    name: 'x_snc_prompt_galle_prompt_version',
    label: 'Prompt Version',
    display: 'version_display',
    extensible: false,
    audit: true,
    allowWebServiceAccess: true,
    accessibleFrom: 'public',
    actions: ['read', 'update', 'create'],
    schema: {
        prompt: ReferenceColumn({
            label: 'Prompt',
            referenceTable: 'x_snc_prompt_galle_prompt',
            mandatory: true,
            cascadeRule: 'cascade',
            attributes: {
                encode_utf8: false,
            },
        }),
        version_number: IntegerColumn({
            label: 'Version Number',
            mandatory: true,
        }),
        status: StringColumn({
            label: 'Status',
            mandatory: true,
            dropdown: 'dropdown_with_none',
            default: 'draft',
            choices: {
                draft: { label: 'Draft', sequence: 0 },
                recommended: { label: 'Recommended', sequence: 1 },
                deprecated: { label: 'Deprecated', sequence: 2 },
            },
        }),
        target_tool: StringColumn({
            label: 'Target Tool',
            dropdown: 'dropdown_with_none',
            choices: {
                general: { label: 'General', sequence: 0 },
                microsoft_copilot: { label: 'Microsoft Copilot', sequence: 1 },
                claude: { label: 'Claude', sequence: 2 },
                now_assist: { label: 'ServiceNow Now Assist', sequence: 3 },
                other: { label: 'Other', sequence: 4 },
            },
        }),
        language: StringColumn({
            label: 'Language',
            maxLength: 5,
            default: 'en',
        }),
        role_instructions: StringColumn({
            label: 'Role / Instructions',
            maxLength: 4000,
        }),
        prompt_body: StringColumn({
            label: 'Prompt Body',
            maxLength: 8000,
            mandatory: true,
        }),
        example_input: StringColumn({
            label: 'Example Input',
            maxLength: 4000,
        }),
        example_output: StringColumn({
            label: 'Example Output',
            maxLength: 4000,
        }),
        rating_sum: IntegerColumn({
            label: 'Rating Sum',
            default: 0,
            readOnly: true,
        }),
        rating_count: IntegerColumn({
            label: 'Rating Count',
            default: 0,
            readOnly: true,
        }),
        usage_count: IntegerColumn({
            label: 'Usage Count',
            default: 0,
            readOnly: true,
        }),
        average_rating: DecimalColumn({
            label: 'Average Rating',
            readOnly: true,
            functionDefinition: 'glidefunction:divide(rating_sum, rating_count)',
        }),
        version_display: StringColumn({
            label: 'Version Display',
            readOnly: true,
            functionDefinition: "glidefunction:concat(prompt.name, ' v', version_number)",
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
        { name: 'index2', element: 'prompt', unique: false },
        { name: 'index3', element: 'status', unique: false },
        { name: 'index4', element: 'target_tool', unique: false },
        { name: 'index6', element: 'usage_count', unique: false },
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
