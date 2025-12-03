import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'
import { prompt_gallery_search_widget } from './widgets/prompt-gallery-search.now'
import { prompt_gallery_main_widget } from './widgets/prompt-gallery-main.now'
import { prompt_gallery_edit_widget } from './widgets/prompt-gallery-edit.now'
import { prompt_gallery_menu_instance } from './menu/prompt-gallery-menu.now'

// Service Portal Page - MUST BE DECLARED FIRST for proper references
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

.page-header {
  background: #fff;
  border-bottom: 1px solid #dee2e6;
  padding: 24px 0;
  margin-bottom: 32px;
}

.page-title {
  color: #333;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

.page-subtitle {
  color: #666;
  font-size: 18px;
  margin: 8px 0 0 0;
}

.main-content {
  margin-bottom: 40px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-header {
    padding: 16px 0;
    margin-bottom: 24px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
}`,
    },
})

// Edit page for prompts
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
}

/* Remove side padding from edit page container */
.prompt-gallery-edit-container .container-fluid {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.edit-page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 0;
  margin-bottom: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-page-title {
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.edit-form-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 32px;
  margin-bottom: 32px;
}

/* Form styling with improved typography */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: block;
  font-size: 16px;
}

.form-control {
  border: 2px solid #e3e6f0;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 16px;
  font-family: "Inter", sans-serif;
  line-height: 1.6;
  transition: border-color 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  font-family: "Inter", sans-serif;
}

.btn-secondary {
  background: #6c757d;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  font-family: "Inter", sans-serif;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .edit-page-header {
    padding: 16px 0;
    margin-bottom: 24px;
  }
  
  .edit-page-title {
    font-size: 24px;
  }
  
  .edit-form-container {
    padding: 24px 16px;
  }
}`,
    },
})

// Service Portal Theme - CORRECTED to use OOB Stock Header directly
export const prompt_gallery_theme = Record({
    $id: Now.ID['prompt_gallery_theme'],
    table: 'sp_theme',
    data: {
        name: 'Prompt Gallery Theme',
        // CRITICAL FIX: Reference the OOB Stock Header directly
        // The OOB Stock Header contains the proper template, scripts, and styling
        header: 'bf5ec2f2cb10120000f8d856634c9c0c', // OOB Stock Header sys_id (from sp_header_footer table)
        css_variables: `// Custom SASS variables for Prompt Gallery
$brand-primary: #0073e6;
$brand-secondary: #6c757d;
$brand-success: #28a745;
$brand-warning: #ffc107;
$brand-danger: #dc3545;
$brand-info: #17a2b8;

// Color palette
$primary-color: #0073e6;
$secondary-color: #f8f9fa;
$accent-color: #28a745;
$text-color: #333;
$text-muted: #6c757d;
$border-color: #dee2e6;

// Typography - Updated for Inter font
$font-family-base: "Inter", sans-serif;
$font-size-base: 16px;
$line-height-base: 1.6;`,
        css: `/* Import Inter font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

/* Global theme styles for Prompt Gallery */
:root {
  --brand-primary: #0073e6;
  --brand-secondary: #6c757d;
  --text-color: #333;
  --text-muted: #6c757d;
  --border-color: #dee2e6;
  --background-color: #f8f9fa;
  --font-family-base: "Inter", sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.6;
}

/* Base typography with improved readability and font smoothing */
body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-color);
  background-color: var(--background-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Improve text readability across the portal */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-base);
  line-height: 1.4;
}

p, div, span, label, button {
  font-family: var(--font-family-base);
}

/* Form controls with improved font size */
.form-control, input, textarea, select {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
}

/* Button text sizing */
.btn {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
}

/* Common card styles */
.card {
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

/* Button styles */
.btn-primary {
  background-color: var(--brand-primary);
  border-color: var(--brand-primary);
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

/* Rating stars */
.rating-stars {
  color: #ffc107;
}

.rating-stars .fa-star-o {
  color: #ddd;
}`,
        footer: '',
        color: '#0073e6',
    },
})

// Service Portal - References theme and page
export const prompt_gallery_portal = Record({
    $id: Now.ID['prompt_gallery_portal'],
    table: 'sp_portal',
    data: {
        url_suffix: 'prompt-gallery',
        title: 'Prompt Gallery Portal',
        theme: prompt_gallery_theme, // Direct reference to theme (which contains the header)
        homepage: prompt_gallery_sp_page, // Direct reference to the page
        sp_rectangle_menu: prompt_gallery_menu_instance, // CRITICAL: Links to menu instance for header navigation
        login_page: '',
        notfound_page: '',
        logo: '',
        css_variables: '',
        rtl_enabled: false,
        quick_start_config: '',
        default: false,
    },
})

// Service Portal Container - CRITICAL: Must reference the page sys_id
export const prompt_gallery_container = Record({
    $id: Now.ID['prompt_gallery_container'],
    table: 'sp_container',
    data: {
        name: 'Prompt Gallery Container',
        sp_page: prompt_gallery_sp_page, // REQUIRED: Direct reference to parent page record
        css_class: 'prompt-gallery-container',
        container_class_name: 'container',
        order: 100, // After breadcrumbs container (50)
        background_color: '',
        background_image: '',
        background_style: '',
        bootstrap_alt: false,
        fixed_header: false,
        width: '',
    },
})

// Service Portal Row for Search
export const prompt_gallery_search_row = Record({
    $id: Now.ID['prompt_gallery_search_row'],
    table: 'sp_row',
    data: {
        sp_container: prompt_gallery_container, // Direct reference to parent container
        order: 100,
        css_class: 'search-row',
    },
})

// Service Portal Row for Main Content
export const prompt_gallery_main_row = Record({
    $id: Now.ID['prompt_gallery_main_row'],
    table: 'sp_row',
    data: {
        sp_container: prompt_gallery_container, // Direct reference to parent container
        order: 200,
        css_class: 'main-row',
    },
})

// Service Portal Column for Search Widget
export const prompt_gallery_search_column = Record({
    $id: Now.ID['prompt_gallery_search_column'],
    table: 'sp_column',
    data: {
        sp_row: prompt_gallery_search_row, // Direct reference to parent row
        order: 100,
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        css_class: 'search-column',
    },
})

// Service Portal Column for Main Widget
export const prompt_gallery_main_column = Record({
    $id: Now.ID['prompt_gallery_main_column'],
    table: 'sp_column',
    data: {
        sp_row: prompt_gallery_main_row, // Direct reference to parent row
        order: 100,
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        css_class: 'main-column',
    },
})

// Service Portal Instance for Search Widget
export const prompt_gallery_search_instance = Record({
    $id: Now.ID['prompt_gallery_search_instance'],
    table: 'sp_instance',
    data: {
        sp_column: prompt_gallery_search_column, // Direct reference to parent column
        sp_widget: prompt_gallery_search_widget, // FIXED: Reference to actual search widget
        order: 100,
        title: '',
        color: 'default',
        size: 'lg',
        bootstrap_color: '',
        width: 12,
        css: '',
        active: true, // CRITICAL: Must be true for widget to be visible
        short_description: 'Advanced search functionality for the prompt gallery',
    },
})

// Service Portal Instance for Main Widget
export const prompt_gallery_main_instance = Record({
    $id: Now.ID['prompt_gallery_main_instance'],
    table: 'sp_instance',
    data: {
        sp_column: prompt_gallery_main_column, // Direct reference to parent column
        sp_widget: prompt_gallery_main_widget, // FIXED: Reference to actual main widget
        order: 100,
        title: '',
        color: 'default',
        size: 'lg',
        bootstrap_color: '',
        width: 12,
        css: '',
        active: true, // CRITICAL: Must be true for widget to be visible
        short_description: 'Main prompt gallery display with cards and filtering',
    },
})

// Edit Page Structure - Breadcrumbs Container, Row, Column, Instance
export const prompt_gallery_edit_breadcrumbs_container = Record({
    $id: Now.ID['prompt_gallery_edit_breadcrumbs_container'],
    table: 'sp_container',
    data: {
        name: 'Edit Prompt - Breadcrumbs - Container 50',
        sp_page: prompt_gallery_edit_sp_page, // Reference to edit page
        css_class: 'breadcrumbs-container',
        container_class_name: 'container-fluid',
        order: 50, // Before the main edit container
        background_color: '',
        background_image: '',
        background_style: 'default',
        bootstrap_alt: false,
        fixed_header: false,
        width: 'container-fluid',
        subheader: 'false',
    },
})

export const prompt_gallery_edit_breadcrumbs_row = Record({
    $id: Now.ID['prompt_gallery_edit_breadcrumbs_row'],
    table: 'sp_row',
    data: {
        sp_container: prompt_gallery_edit_breadcrumbs_container, // Reference to breadcrumbs container
        order: 100,
        css_class: 'breadcrumbs-row',
    },
})

export const prompt_gallery_edit_breadcrumbs_column = Record({
    $id: Now.ID['prompt_gallery_edit_breadcrumbs_column'],
    table: 'sp_column',
    data: {
        sp_row: prompt_gallery_edit_breadcrumbs_row, // Reference to breadcrumbs row
        order: 100,
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        css_class: 'breadcrumbs-column',
    },
})

export const prompt_gallery_edit_breadcrumbs_instance = Record({
    $id: Now.ID['prompt_gallery_edit_breadcrumbs_instance'],
    table: 'sp_instance',
    data: {
        sp_column: prompt_gallery_edit_breadcrumbs_column, // Reference to breadcrumbs column
        sp_widget: '0fb269305b3212000d7ec7ad31f91ae2', // OOB breadcrumbs widget sys_id
        order: 100,
        title: '',
        color: 'default',
        size: 'lg',
        bootstrap_color: '',
        width: 12,
        css: '',
        active: true, // Must be true for widget to be visible
        short_description: 'Breadcrumb navigation for edit page',
    },
})

// Edit Page Structure - Container, Row, Column, Instance for Edit Widget
export const prompt_gallery_edit_container = Record({
    $id: Now.ID['prompt_gallery_edit_container'],
    table: 'sp_container',
    data: {
        name: 'Edit Prompt - Prompt Gallery - Container 100',
        sp_page: prompt_gallery_edit_sp_page, // Reference to edit page
        css_class: 'prompt-gallery-edit-container',
        container_class_name: 'container-fluid',
        order: 100,
        background_color: '',
        background_image: '',
        background_style: 'default',
        bootstrap_alt: false,
        fixed_header: false,
        width: 'container-fluid',
        subheader: 'false',
    },
})

export const prompt_gallery_edit_row = Record({
    $id: Now.ID['prompt_gallery_edit_row'],
    table: 'sp_row',
    data: {
        sp_container: prompt_gallery_edit_container, // Reference to edit container
        order: 100,
        css_class: 'edit-row',
    },
})

export const prompt_gallery_edit_column = Record({
    $id: Now.ID['prompt_gallery_edit_column'],
    table: 'sp_column',
    data: {
        sp_row: prompt_gallery_edit_row, // Reference to edit row
        order: 100,
        size_xs: 12,
        size_sm: 12,
        size_md: 12,
        size_lg: 12,
        css_class: 'edit-column',
    },
})

export const prompt_gallery_edit_instance = Record({
    $id: Now.ID['prompt_gallery_edit_instance'],
    table: 'sp_instance',
    data: {
        sp_column: prompt_gallery_edit_column, // Reference to edit column
        sp_widget: prompt_gallery_edit_widget, // Reference to edit widget record
        order: 100,
        title: '',
        color: 'default',
        size: 'lg',
        bootstrap_color: '',
        width: 12,
        css: '',
        active: true, // Must be true for widget to be visible
        short_description: 'Widget for editing prompt details and content',
    },
})