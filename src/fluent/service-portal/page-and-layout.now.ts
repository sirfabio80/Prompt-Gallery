import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Service Portal Page - Main prompt gallery page
export const prompt_gallery_sp_page = Record({
    $id: Now.ID['prompt_gallery_sp_page'],
    table: 'sp_page',
    data: {
        id: 'prompt_gallery',
        title: 'Prompt Gallery',
        short_description: 'Browse and discover AI prompts for various use cases',
        internal: false,
        public: false,
        roles: [],
        css: `/* Custom CSS for Prompt Gallery Page */
.prompt-gallery-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 32px;
}

.gallery-section {
  background: transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-header-section {
    padding: 24px 0;
    margin-bottom: 20px;
  }
  
  .search-section {
    padding: 16px;
    margin-bottom: 24px;
  }
}`,
    },
})

// Main container for the prompt gallery page - MUST reference sp_page directly
export const prompt_gallery_container = Record({
    $id: Now.ID['prompt_gallery_container'],
    table: 'sp_container',
    data: {
        sp_page: '848eb10632fe45808e7c2da50b7ec266', // Direct reference to the actual page sys_id
        name: 'Prompt Gallery - Container 2',
        title: 'Main Container',
        bootstrap_alt: false,
        background_color: '',
        background_image: '',
        class_name: 'container-fluid',
        color: '',
        order: 2,
        css: `
.container-fluid {
    padding: 0 15px;
    max-width: 1200px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .container-fluid {
        padding: 0 10px;
    }
}`,
        subheader: 'false',
        width: 'container',
    },
})

// Row for heading widget - MUST reference sp_container directly
// Row for search widget - MUST reference sp_container directly
export const prompt_gallery_search_row = Record({
    $id: Now.ID['prompt_gallery_search_row'],
    table: 'sp_row',
    data: {
        sp_container: 'c21ab314e0204ad8b35377be4d00482d', // Direct reference to actual container sys_id
        name: 'Search Row',
        title: 'Search Widget Row',
        class_name: 'row search-row',
        order: 2,
    },
})

// Column for heading widget (full width) - MUST reference sp_row directly
export const prompt_gallery_heading_column = Record({
    $id: Now.ID['prompt_gallery_heading_column'],
    table: 'sp_column',
    data: {
        sp_row: 'h1234567890123456789012345678901234567890', // Direct reference to actual heading row sys_id
        name: 'Heading Column',
        title: 'Heading Widget Column',
        class_name: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        order: 1,
        size: '12',
    },
})

// Column for search widget (full width) - MUST reference sp_row directly
export const prompt_gallery_search_column = Record({
    $id: Now.ID['prompt_gallery_search_column'],
    table: 'sp_column',
    data: {
        sp_row: 'cd6e392cdd04466d8c35fe52cb263a27', // Direct reference to actual search row sys_id
        name: 'Search Column',
        title: 'Search Widget Column',
        class_name: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        order: 1,
    },
})

// Row for gallery widget - MUST reference sp_container directly
export const prompt_gallery_main_row = Record({
    $id: Now.ID['prompt_gallery_main_row'],
    table: 'sp_row',
    data: {
        sp_container: 'c21ab314e0204ad8b35377be4d00482d', // Direct reference to actual container sys_id
        name: 'Gallery Row',
        title: 'Gallery Widget Row',
        class_name: 'row gallery-row',
        order: 3,
    },
})

// Column for gallery widget (full width) - MUST reference sp_row directly
export const prompt_gallery_main_column = Record({
    $id: Now.ID['prompt_gallery_main_column'],
    table: 'sp_column',
    data: {
        sp_row: 'a967aab80c364d72b4b987c8fd61ec09', // Direct reference to actual gallery row sys_id
        name: 'Gallery Column',
        title: 'Gallery Widget Column',
        class_name: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        order: 1,
        size: '12',
    },
})

// Widget instances - MUST reference sp_column directly
export const prompt_gallery_heading_widget_instance = Record({
    $id: Now.ID['prompt_gallery_heading_widget_instance'],
    table: 'sp_instance',
    data: {
        sp_widget: 'prompt_gallery_heading_widget', // Reference to the heading widget
        sp_column: 'h9999999999999999999999999999999999999999', // Direct reference to heading column
        title: 'Prompt Gallery Heading',
        short_description: 'Page heading with title and subtitle',
        order: 1,
        color: 'default',
        size: 'md',
        options: JSON.stringify({
            title: 'Prompt Gallery',
            subtitle: 'Discover and share AI prompts for enhanced productivity',
        }),
        active: true,
        advanced_placeholder_dimensions: 'false',
        async_load: 'false',
        css: `/* Heading widget instance styling */
.prompt-gallery-heading-widget {
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
}`,
        preserve_placeholder_size: 'false',
    },
})

export const prompt_gallery_search_widget_instance = Record({
    $id: Now.ID['prompt_gallery_search_widget_instance'],
    table: 'sp_instance',
    data: {
        sp_widget: '9832bf6966444aa8a6341611ca7488b6',
        sp_column: 'd99d94f987984de8aa13128ed12dbd77', // Direct reference to column
        title: 'Search Prompts',
        short_description: 'Search and filter prompts',
        order: 1,
        color: 'default',
        size: 'md',
        options: JSON.stringify({
            placeholder: 'Search prompts by title, category, or tags...',
            enable_filters: true,
            show_category_filter: true,
            show_tag_filter: true,
            enable_sort: true,
        }),
        active: true,
        advanced_placeholder_dimensions: 'false',
        async_load: 'false',
        css: `/* Search widget instance styling */
.prompt-gallery-search-widget {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    padding: 24px;
    margin-bottom: 32px;
}`,
        preserve_placeholder_size: 'false',
    },
})

export const prompt_gallery_main_widget_instance = Record({
    $id: Now.ID['prompt_gallery_main_widget_instance'],
    table: 'sp_instance',
    data: {
        sp_widget: '5d2fa01de7b1410d870314a1cd918253',
        sp_column: 'd69baf81a5624720b483ae005dbe2187', // Direct reference to column
        title: 'Prompt Gallery',
        short_description: 'Browse and view prompts',
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
        active: true,
        advanced_placeholder_dimensions: 'false',
        async_load: 'false',
        css: `/* Main widget instance styling */
.prompt-gallery-main-widget {
    background: transparent;
    border: none;
    padding: 0;
}

.prompt-cards-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
    padding: 0;
}

.prompt-card {
    background: white;
    border: 1px solid #e3e6f0;
    border-radius: 12px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.prompt-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
}`,
        preserve_placeholder_size: 'false',
    },
})

// Edit page for prompts (future use)
export const prompt_gallery_edit_sp_page = Record({
    $id: Now.ID['prompt_gallery_edit_sp_page'],
    table: 'sp_page',
    data: {
        id: 'prompt_gallery_edit',
        title: 'Edit Prompt - Prompt Gallery',
        short_description: 'Edit prompt details and content',
        internal: false,
        public: false,
        roles: [],
        css: `/* Custom CSS for Prompt Gallery Edit Page */
.prompt-gallery-edit-page {
  background: #f8f9fa;
  min-height: 100vh;
  padding: 20px 0;
}

.edit-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 32px;
  margin-bottom: 32px;
}`,
    },
})
