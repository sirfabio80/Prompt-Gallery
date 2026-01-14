import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

// =============================================================================
// PROMPT TABLE LAYOUTS
// =============================================================================

// Define the form layout for the Prompt table
export const prompt_form_list = List({
    table: 'x_snc_prompt_galle_prompt',
    view: default_view,
    columns: [
        // Section 1: Primary Information
        { element: 'name', position: 0 },
        { element: 'short_description', position: 1 },
        { element: 'category', position: 2 },
        { element: 'owner_team', position: 3 },
        { element: 'is_active', position: 4 },
        
        // Section 2: Content
        { element: 'full_prompt', position: 5 },
        
        // Section 3: Metadata (split layout)
        { element: '.begin_split', position: 6 },
        { element: 'created_by', position: 7 },
        { element: 'created_on', position: 8 },
        { element: '.split', position: 9 },
        { element: 'updated_by', position: 10 },
        { element: 'updated_on', position: 11 },
        { element: '.end_split', position: 12 },
        
        // Section 4: Analytics (split layout) 
        { element: '.begin_split', position: 13 },
        { element: 'latest_version_number', position: 14 },
        { element: '.split', position: 15 },
        { element: 'total_usage_count', position: 16 },
        { element: '.end_split', position: 17 }
    ]
})

// Define the list view for the Prompt table (what users see in the list)
export const prompt_list_view = List({
    table: 'x_snc_prompt_galle_prompt',
    view: default_view,
    columns: [
        { element: 'name', position: 0 },
        { element: 'short_description', position: 1 },
        { element: 'category', position: 2 },
        { element: 'owner_team', position: 3 },
        { element: 'is_active', position: 4 },
        { element: 'latest_version_number', position: 5 },
        { element: 'total_usage_count', position: 6 },
        { element: 'updated_on', position: 7 }
    ]
})

// =============================================================================
// CATEGORY TABLE LAYOUTS
// =============================================================================

// Define the form layout for the Category table
export const category_form_list = List({
    table: 'x_snc_prompt_galle_category',
    view: default_view,
    columns: [
        // Section 1: Basic Information
        { element: 'name', position: 0 },
        { element: 'display_name', position: 1 },
        { element: 'description', position: 2 },
        { element: 'sequence', position: 3 },
        { element: 'is_active', position: 4 },
        
        // Section 2: Visual Properties (split layout)
        { element: '.begin_split', position: 5 },
        { element: 'icon', position: 6 },
        { element: '.split', position: 7 },
        { element: 'color', position: 8 },
        { element: '.end_split', position: 9 },
        
        // Section 3: Analytics
        { element: 'prompt_count', position: 10 }
    ]
})

// Define the list view for the Category table
export const category_list_view = List({
    table: 'x_snc_prompt_galle_category',
    view: default_view,
    columns: [
        { element: 'display_name', position: 0 },
        { element: 'name', position: 1 },
        { element: 'description', position: 2 },
        { element: 'sequence', position: 3 },
        { element: 'prompt_count', position: 4 },
        { element: 'is_active', position: 5 }
    ]
})

// =============================================================================
// TAG TABLE LAYOUTS
// =============================================================================

// Define the form layout for the Tag table
export const tag_form_list = List({
    table: 'x_snc_prompt_galle_tag',
    view: default_view,
    columns: [
        // Section 1: Basic Information
        { element: 'name', position: 0 },
        { element: 'tag_category', position: 1 },
        { element: 'description', position: 2 },
        { element: 'is_active', position: 3 },
        
        // Section 2: Metadata (split layout)
        { element: '.begin_split', position: 4 },
        { element: 'created_by', position: 5 },
        { element: 'created_on', position: 6 },
        { element: '.split', position: 7 },
        { element: 'updated_by', position: 8 },
        { element: 'updated_on', position: 9 },
        { element: '.end_split', position: 10 }
    ]
})

// Define the list view for the Tag table
export const tag_list_view = List({
    table: 'x_snc_prompt_galle_tag',
    view: default_view,
    columns: [
        { element: 'name', position: 0 },
        { element: 'tag_category', position: 1 },
        { element: 'description', position: 2 },
        { element: 'is_active', position: 3 },
        { element: 'created_on', position: 4 }
    ]
})

// =============================================================================
// ENGAGEMENT TABLE LAYOUTS
// =============================================================================

// Define the form layout for the Engagement table
export const engagement_form_list = List({
    table: 'x_snc_prompt_galle_engagement',
    view: default_view,
    columns: [
        // Section 1: Primary Information
        { element: 'name', position: 0 },
        { element: 'customer_name', position: 1 },
        { element: 'geo_region', position: 2 },
        { element: 'description', position: 3 },
        
        // Section 2: Timeline (split layout)
        { element: '.begin_split', position: 4 },
        { element: 'start_date', position: 5 },
        { element: '.split', position: 6 },
        { element: 'end_date', position: 7 },
        { element: '.end_split', position: 8 },
        
        // Section 3: Metadata (split layout)
        { element: '.begin_split', position: 9 },
        { element: 'created_by', position: 10 },
        { element: 'created_on', position: 11 },
        { element: '.split', position: 12 },
        { element: 'updated_by', position: 13 },
        { element: 'updated_on', position: 14 },
        { element: '.end_split', position: 15 }
    ]
})

// Define the list view for the Engagement table
export const engagement_list_view = List({
    table: 'x_snc_prompt_galle_engagement',
    view: default_view,
    columns: [
        { element: 'name', position: 0 },
        { element: 'customer_name', position: 1 },
        { element: 'geo_region', position: 2 },
        { element: 'start_date', position: 3 },
        { element: 'end_date', position: 4 },
        { element: 'created_by', position: 5 }
    ]
})