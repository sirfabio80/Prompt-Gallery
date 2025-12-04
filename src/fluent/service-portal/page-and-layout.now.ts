import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'
import { prompt_gallery_breadcrumbs_widget } from './widgets/prompt-gallery-breadcrumbs.now'
import { prompt_gallery_create_widget } from './widgets/prompt-gallery-create.now'

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

// Create page for new prompts
export const prompt_gallery_create_sp_page = Record({
    $id: Now.ID['prompt_gallery_create_sp_page'],
    table: 'sp_page',
    data: {
        id: 'prompt_create',
        title: 'Create New Prompt',
        short_description: 'Create a new prompt for the gallery',
        internal: false,
        public: false,
        roles: [],
        css: `/* Custom CSS for Prompt Gallery Create Page */
.prompt-gallery-create-page {
  background: #f8f9fa;
  min-height: 100vh;
}

.breadcrumbs-section {
  background: white;
  border-bottom: 1px solid #e3e6f0;
  padding: 16px 0;
  margin-bottom: 24px;
}

.create-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 32px;
  margin-bottom: 32px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.form-section {
  margin-bottom: 24px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
  background: #fff;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

textarea.form-control {
  min-height: 120px;
  resize: vertical;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox-wrapper input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  margin-top: 32px;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

.alert {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid;
}

.alert-success {
  background: #d1fae5;
  border-color: #a7f3d0;
  color: #065f46;
}

.alert-danger {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #991b1b;
}

/* Responsive design */
@media (max-width: 768px) {
  .create-form-container {
    margin: 0 16px 24px 16px;
    padding: 24px;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn {
    justify-content: center;
  }
}`,
    },
})

// Create page containers - MUST reference the page Record object, not string
export const prompt_gallery_create_container1 = Record({
    $id: Now.ID['prompt_gallery_create_container1'],
    table: 'sp_container',
    data: {
        sp_page: prompt_gallery_create_sp_page, // CORRECT - Reference to the Record object
        name: 'Create Page - Breadcrumbs Container',
        title: 'Breadcrumbs Container',
        bootstrap_alt: false,
        background_color: '',
        background_image: '',
        class_name: 'container-fluid breadcrumbs-section',
        color: '',
        order: 1,
        css: `
.breadcrumbs-section {
    background: white;
    border-bottom: 1px solid #e3e6f0;
    padding: 16px 0;
    margin-bottom: 0;
}

.container-fluid {
    padding: 0 15px;
    max-width: 1200px;
    margin: 0 auto;
}`,
        subheader: 'false',
        width: 'container',
    },
})

export const prompt_gallery_create_container2 = Record({
    $id: Now.ID['prompt_gallery_create_container2'],
    table: 'sp_container',
    data: {
        sp_page: prompt_gallery_create_sp_page, // CORRECT - Reference to the Record object
        name: 'Create Page - Form Container',
        title: 'Form Container',
        bootstrap_alt: false,
        background_color: '',
        background_image: '',
        class_name: 'container-fluid form-section',
        color: '',
        order: 2,
        css: `
.form-section {
    padding: 24px 0;
}

.container-fluid {
    padding: 0 15px;
    max-width: 1200px;
    margin: 0 auto;
}`,
        subheader: 'false',
        width: 'container',
    },
})

// Create rows - MUST reference the container Record objects
export const prompt_gallery_create_breadcrumb_row = Record({
    $id: Now.ID['prompt_gallery_create_breadcrumb_row'],
    table: 'sp_row',
    data: {
        sp_container: prompt_gallery_create_container1, // CORRECT - Reference to the Record object
        name: 'Breadcrumbs Row',
        title: 'Breadcrumbs Row',
        class_name: 'row',
        order: 1,
    },
})

export const prompt_gallery_create_form_row = Record({
    $id: Now.ID['prompt_gallery_create_form_row'],
    table: 'sp_row',
    data: {
        sp_container: prompt_gallery_create_container2, // CORRECT - Reference to the Record object
        name: 'Form Row',
        title: 'Create Form Row',
        class_name: 'row',
        order: 1,
    },
})

// Create columns - MUST reference the row Record objects
export const prompt_gallery_create_breadcrumb_column = Record({
    $id: Now.ID['prompt_gallery_create_breadcrumb_column'],
    table: 'sp_column',
    data: {
        sp_row: prompt_gallery_create_breadcrumb_row, // CORRECT - Reference to the Record object
        name: 'Breadcrumbs Column',
        title: 'Breadcrumbs Column',
        class_name: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        order: 1,
        size: '12',
    },
})

export const prompt_gallery_create_form_column = Record({
    $id: Now.ID['prompt_gallery_create_form_column'],
    table: 'sp_column',
    data: {
        sp_row: prompt_gallery_create_form_row, // CORRECT - Reference to the Record object
        name: 'Form Column',
        title: 'Create Form Column',
        class_name: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        order: 1,
        size: '12',
    },
})

// Create widget instances - MUST reference the column Record objects and widget Record objects
export const prompt_gallery_create_breadcrumb_instance = Record({
    $id: Now.ID['prompt_gallery_create_breadcrumb_instance'],
    table: 'sp_instance',
    data: {
        sp_widget: prompt_gallery_breadcrumbs_widget, // CORRECT - Reference to the widget Record object
        sp_column: prompt_gallery_create_breadcrumb_column, // CORRECT - Reference to the column Record object
        title: 'Breadcrumbs',
        short_description: 'Navigation breadcrumbs',
        order: 1,
        color: 'default',
        size: 'md',
        options: JSON.stringify({
            current_page: 'Create New Prompt'
        }),
        active: true,
        advanced_placeholder_dimensions: 'false',
        async_load: 'false',
        css: `
/* Breadcrumbs container styling */
.prompt-gallery-breadcrumbs-widget {
    margin: 0;
    padding: 0;
    background: transparent;
    border: none;
}`,
        preserve_placeholder_size: 'false',
    },
})

export const prompt_gallery_create_form_instance = Record({
    $id: Now.ID['prompt_gallery_create_form_instance'],
    table: 'sp_instance',
    data: {
        sp_widget: prompt_gallery_create_widget, // CORRECT - Reference to the widget Record object
        sp_column: prompt_gallery_create_form_column, // CORRECT - Reference to the column Record object
        title: 'Create New Prompt Form',
        short_description: 'Form for creating new prompts',
        order: 1,
        color: 'default',
        size: 'md',
        options: JSON.stringify({}),
        active: true,
        advanced_placeholder_dimensions: 'false',
        async_load: 'false',
        css: `
/* Form widget styling */
.prompt-gallery-create-widget {
    background: transparent;
    border: none;
    padding: 0;
}`,
        preserve_placeholder_size: 'false',
    },
})
