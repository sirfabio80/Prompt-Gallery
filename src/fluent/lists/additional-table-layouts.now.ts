import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

// =============================================================================
// PROMPT USAGE TABLE LAYOUTS
// =============================================================================

// Define the form layout for the Prompt Usage table
export const prompt_usage_form_list = List({
    table: 'x_snc_prompt_galle_prompt_usage',
    view: default_view,
    columns: [
        // Section 1: Core Information
        { element: 'prompt_version', position: 0 },
        { element: 'used_by', position: 1 },
        { element: 'used_at', position: 2 },
        { element: 'engagement', position: 3 },
        
        // Section 2: Context Information  
        { element: 'context_description', position: 4 },
        { element: 'tool_used', position: 5 },
        
        // Section 3: Display Value
        { element: 'display_value', position: 6 }
    ]
})

// Define the list view for the Prompt Usage table
export const prompt_usage_list_view = List({
    table: 'x_snc_prompt_galle_prompt_usage',
    view: default_view,
    columns: [
        { element: 'prompt_version', position: 0 },
        { element: 'used_by', position: 1 },
        { element: 'used_at', position: 2 },
        { element: 'tool_used', position: 3 },
        { element: 'engagement', position: 4 }
    ]
})

// =============================================================================
// PROMPT VERSION TABLE LAYOUTS
// =============================================================================

// Define the form layout for the Prompt Version table
export const prompt_version_form_list = List({
    table: 'x_snc_prompt_galle_prompt_version',
    view: default_view,
    columns: [
        // Section 1: Basic Information
        { element: 'prompt', position: 0 },
        { element: 'version_number', position: 1 },
        { element: 'status', position: 2 },
        { element: 'target_tool', position: 3 },
        { element: 'language', position: 4 },
        
        // Section 2: Content
        { element: 'role_instructions', position: 5 },
        { element: 'prompt_body', position: 6 },
        { element: 'example_input', position: 7 },
        { element: 'example_output', position: 8 },
        
        // Section 3: Analytics (split layout)
        { element: '.begin_split', position: 9 },
        { element: 'usage_count', position: 10 },
        { element: 'rating_count', position: 11 },
        { element: '.split', position: 12 },
        { element: 'rating_sum', position: 13 },
        { element: 'average_rating', position: 14 },
        { element: '.end_split', position: 15 },
        
        // Section 4: Metadata (split layout)
        { element: '.begin_split', position: 16 },
        { element: 'created_by', position: 17 },
        { element: 'created_on', position: 18 },
        { element: '.split', position: 19 },
        { element: 'updated_by', position: 20 },
        { element: 'updated_on', position: 21 },
        { element: '.end_split', position: 22 },
        
        // Section 5: Computed Display
        { element: 'version_display', position: 23 }
    ]
})

// Define the list view for the Prompt Version table
export const prompt_version_list_view = List({
    table: 'x_snc_prompt_galle_prompt_version',
    view: default_view,
    columns: [
        { element: 'version_display', position: 0 },
        { element: 'status', position: 1 },
        { element: 'target_tool', position: 2 },
        { element: 'language', position: 3 },
        { element: 'usage_count', position: 4 },
        { element: 'average_rating', position: 5 },
        { element: 'updated_on', position: 6 }
    ]
})

// =============================================================================
// PROMPT TAG TABLE LAYOUTS  
// =============================================================================

// Define the form layout for the Prompt Tag table (many-to-many relationship)
export const prompt_tag_form_list = List({
    table: 'x_snc_prompt_galle_prompt_tag',
    view: default_view,
    columns: [
        // Section 1: Relationship Information
        { element: 'prompt', position: 0 },
        { element: 'tag', position: 1 },
        { element: 'display_value', position: 2 },
        { element: 'created_on', position: 3 }
    ]
})

// Define the list view for the Prompt Tag table
export const prompt_tag_list_view = List({
    table: 'x_snc_prompt_galle_prompt_tag',
    view: default_view,
    columns: [
        { element: 'prompt', position: 0 },
        { element: 'tag', position: 1 },
        { element: 'created_on', position: 2 }
    ]
})