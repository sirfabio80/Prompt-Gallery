import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Widget instance for the search functionality
export const prompt_gallery_search_widget_instance = Record({
    $id: Now.ID['prompt_gallery_search_widget_instance'],
    table: 'sp_instance',
    data: {
        sp_widget: Now.ID['prompt_gallery_search_widget'],
        title: 'Search Prompts',
        order: 0,
        color: 'default',
        size: 'md',
        options: JSON.stringify({
            placeholder: 'Search prompts by title, category, or tags...',
            enable_filters: true,
            show_category_filter: true,
            show_tag_filter: true,
            enable_sort: true,
        }),
    },
})

// Widget instance for the main prompt gallery content
export const prompt_gallery_main_widget_instance = Record({
    $id: Now.ID['prompt_gallery_main_widget_instance'],
    table: 'sp_instance',
    data: {
        sp_widget: Now.ID['prompt_gallery_main_widget'],
        title: 'Prompt Gallery',
        order: 1,
        color: 'default',
        size: 'md',
        options: JSON.stringify({
            cards_per_page: 12,
            enable_pagination: true,
            show_load_more: true,
            card_layout: 'grid',
            enable_favorites: true,
            show_engagement_stats: true,
        }),
    },
})