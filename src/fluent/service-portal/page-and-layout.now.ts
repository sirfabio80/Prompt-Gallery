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

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.page-subtitle {
  font-size: 18px;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.main-content {
  margin-bottom: 40px;
}

/* Widget containers */
.widget-search {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 24px;
  margin-bottom: 32px;
}

.widget-gallery {
  background: transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-header {
    padding: 24px 0;
    margin-bottom: 20px;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
}`,
    },
})

// Simple container for the prompt gallery page
export const prompt_gallery_container = Record({
    $id: Now.ID['prompt_gallery_container'],
    table: 'sp_container',
    data: {
        name: 'Prompt Gallery Container',
        title: 'Main Container',
        bootstrap_alt: false,
        background_color: '',
        background_image: '',
        class_name: 'container-fluid prompt-gallery-main',
        color: '',
        css: `
.prompt-gallery-main {
    padding: 0;
    max-width: 1200px;
    margin: 0 auto;
}`,
    },
})

// Single row for the page content
export const prompt_gallery_row = Record({
    $id: Now.ID['prompt_gallery_row'],
    table: 'sp_row',
    data: {
        name: 'Prompt Gallery Row',
        title: 'Main Row',
        class_name: 'row',
        order: 0,
    },
})

// Full width column
export const prompt_gallery_column = Record({
    $id: Now.ID['prompt_gallery_column'],
    table: 'sp_column',
    data: {
        name: 'Prompt Gallery Column',
        title: 'Main Column',
        class_name: 'col-md-12',
        size: 12,
        order: 0,
    },
})

// Connect page to container
export const prompt_gallery_page_to_container = Record({
    $id: Now.ID['prompt_gallery_page_to_container'],
    table: 'sp_page_container',
    data: {
        sp_page: Now.ID['prompt_gallery_sp_page'],
        sp_container: Now.ID['prompt_gallery_container'],
        order: 0,
    },
})

// Connect container to row
export const prompt_gallery_container_to_row = Record({
    $id: Now.ID['prompt_gallery_container_to_row'],
    table: 'sp_container_row',
    data: {
        sp_container: Now.ID['prompt_gallery_container'],
        sp_row: Now.ID['prompt_gallery_row'],
        order: 0,
    },
})

// Connect row to column
export const prompt_gallery_row_to_column = Record({
    $id: Now.ID['prompt_gallery_row_to_column'],
    table: 'sp_row_column',
    data: {
        sp_row: Now.ID['prompt_gallery_row'],
        sp_column: Now.ID['prompt_gallery_column'],
        order: 0,
    },
})

// Connect widgets to the column
export const search_widget_to_column = Record({
    $id: Now.ID['search_widget_to_column'],
    table: 'sp_column_instance',
    data: {
        sp_column: Now.ID['prompt_gallery_column'],
        sp_instance: Now.ID['prompt_gallery_search_widget_instance'],
        order: 0,
    },
})

export const main_widget_to_column = Record({
    $id: Now.ID['main_widget_to_column'],
    table: 'sp_column_instance',
    data: {
        sp_column: Now.ID['prompt_gallery_column'],
        sp_instance: Now.ID['prompt_gallery_main_widget_instance'],
        order: 1,
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