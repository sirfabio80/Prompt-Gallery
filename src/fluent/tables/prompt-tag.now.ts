import '@servicenow/sdk/global'
import { Table, ReferenceColumn, DateTimeColumn, StringColumn } from '@servicenow/sdk/core'

// Prompt Tag table - many-to-many relationship between Prompts and Tags
export const x_snc_prompt_galle_prompt_tag = Table({
    name: 'x_snc_prompt_galle_prompt_tag',
    label: 'Prompt Tag',
    display: 'display_value',
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
        tag: ReferenceColumn({
            label: 'Tag',
            referenceTable: 'x_snc_prompt_galle_tag',
            mandatory: true,
            cascadeRule: 'cascade',
            attributes: {
                encode_utf8: false,
            },
        }),
        display_value: StringColumn({
            label: 'Display Value',
            readOnly: true,
            functionDefinition: "glidefunction:concat(prompt.name, ' - ', tag.name)",
        }),
        created_on: DateTimeColumn({
            label: 'Created On',
            readOnly: true,
        }),
    },
    index: [
        { name: 'index', element: 'prompt', unique: false },
        { name: 'index2', element: 'tag', unique: false },
    ],
    allowClientScripts: true,
    allowNewFields: true,
    allowUiActions: true,
})
