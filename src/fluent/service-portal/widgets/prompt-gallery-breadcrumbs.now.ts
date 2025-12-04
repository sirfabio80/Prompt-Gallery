import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const prompt_gallery_breadcrumbs_widget = Record({
    $id: Now.ID['prompt_gallery_breadcrumbs_widget'],
    table: 'sp_widget',
    data: {
        id: 'prompt_gallery_breadcrumbs',
        name: 'Prompt Gallery Breadcrumbs',
        description: 'Simple breadcrumbs navigation for Prompt Gallery',
        template: `<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item">
      <a href="?id=prompt_gallery">
        <i class="fa fa-home" aria-hidden="true"></i> Home
      </a>
    </li>
    <li class="breadcrumb-item">
      <a href="?id=prompt_gallery">Prompt Gallery</a>
    </li>
    <li class="breadcrumb-item active" aria-current="page">
      {{c.data.current_page || 'Create New Prompt'}}
    </li>
  </ol>
</nav>`,
        client_script: `function() {
  var c = this;
  // Simple client-side logic if needed
  c.data.current_page = c.options.current_page || 'Create New Prompt';
}`,
        script: `(function() {
  data.current_page = options.current_page || 'Create New Prompt';
})();`,
        css: `/* Simple breadcrumbs styling */
.breadcrumb {
    background: transparent;
    margin: 0;
    padding: 0;
    font-size: 14px;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
    color: #6b7280;
}

.breadcrumb-item + .breadcrumb-item::before {
    content: "›";
    color: #9ca3af;
    font-weight: normal;
    padding: 0 12px;
    display: inline-block;
}

.breadcrumb-item a {
    color: #667eea;
    text-decoration: none;
    transition: color 0.2s ease;
}

.breadcrumb-item a:hover {
    text-decoration: none;
    color: #5a67d8;
}

.breadcrumb-item.active {
    color: #374151;
    font-weight: 500;
}

.breadcrumb-item i {
    margin-right: 6px;
    font-size: 13px;
}

/* Responsive design */
@media (max-width: 768px) {
    .breadcrumb {
        font-size: 13px;
    }
    
    .breadcrumb-item + .breadcrumb-item::before {
        padding: 0 8px;
    }
}`,
        option_schema: '[{"name":"current_page","label":"Current Page","type":"string","default_value":"Create New Prompt"}]',
        demo_data: '{"current_page": "Create New Prompt"}',
        docs: 'Simple breadcrumbs navigation widget for the Prompt Gallery',
        public: false,
        has_preview: true,
        servicenow: false,
        data_table: 'sp_instance',
        controller_as: 'c',
        internal: false,
    },
})