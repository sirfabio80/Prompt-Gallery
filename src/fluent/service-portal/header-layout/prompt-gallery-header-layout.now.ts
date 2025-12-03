import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Row for header widget
export const prompt_gallery_header_row = Record({
    $id: Now.ID['prompt_gallery_header_row'],
    table: 'sp_row',
    data: {
        name: 'Header Row',
        title: 'Header Widget Row',
        class_name: 'row header-row',
        order: 50,
    },
})

// Column for header widget (full width)
export const prompt_gallery_header_column = Record({
    $id: Now.ID['prompt_gallery_header_column'],
    table: 'sp_column',
    data: {
        name: 'Header Column',
        title: 'Header Widget Column',
        class_name: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        order: 100,
    },
})

// Widget instance for the header
export const prompt_gallery_header_widget_instance = Record({
    $id: Now.ID['prompt_gallery_header_widget_instance'],
    table: 'sp_instance',
    data: {
        title: 'Prompt Gallery Header',
        short_description: 'Page header with title and subtitle',
        order: 100,
        color: 'default',
        size: 'md',
        options: JSON.stringify({
            title: 'Prompt Gallery',
            subtitle: 'Discover and share AI prompts for enhanced productivity',
        }),
        active: true,
        advanced_placeholder_dimensions: 'false',
        async_load: 'false',
        css: `/* Header widget instance styling */
.prompt-gallery-header-widget {
    margin-bottom: 0;
    padding: 0;
}`,
        preserve_placeholder_size: 'false',
    },
})