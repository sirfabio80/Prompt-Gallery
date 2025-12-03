import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

export const prompt_gallery_search_widget = Record({
  $id: Now.ID['prompt_gallery_search_widget'],
  table: 'sp_widget',
  data: {
    id: 'prompt_gallery_search',
    name: 'Prompt Gallery Search',
    description: 'Advanced search widget for the prompt gallery with filters and sorting',
    template: Now.include('../../../client/service-portal/widgets/prompt-gallery-search/template.html'),
    client_script: Now.include('../../../client/service-portal/widgets/prompt-gallery-search/client.js'),
    script: `(function() {
      // Server script for Prompt Gallery Search widget
      data.search_placeholder = options.search_placeholder || 'Search prompts, descriptions, or content...';
      data.show_advanced = options.show_advanced !== 'false';
      data.show_sorting = options.show_sorting !== 'false';
      
      // Get available categories
      data.categories = [];
      var catGr = new GlideRecord('x_snc_prompt_galle_category');
      catGr.addQuery('is_active', true);
      catGr.orderBy('sequence');
      catGr.query();
      
      while (catGr.next()) {
        data.categories.push({
          value: catGr.getUniqueValue(),  // Use sys_id instead of name
          label: catGr.getValue('display_name'),
          name: catGr.getValue('name'),   // Keep name for reference
          description: catGr.getValue('description'),
          icon: catGr.getValue('icon'),
          color: catGr.getValue('color'),
          prompt_count: catGr.getValue('prompt_count')
        });
      }
      
      // Get available target tools
      data.target_tools = [];
      var toolGr = new GlideRecord('sys_choice');
      toolGr.addQuery('table', 'x_snc_prompt_galle_prompt_version');
      toolGr.addQuery('element', 'target_tool');
      toolGr.orderBy('sequence');
      toolGr.query();
      
      while (toolGr.next()) {
        data.target_tools.push({
          value: toolGr.getValue('value'),
          label: toolGr.getValue('label')
        });
      }
      
      // Get available tags
      data.available_tags = [];
      var tagGr = new GlideRecord('x_snc_prompt_galle_tag');
      tagGr.addQuery('is_active', true);
      tagGr.orderBy('name');
      tagGr.query();
      
      while (tagGr.next()) {
        data.available_tags.push({
          sys_id: tagGr.getUniqueValue(),
          name: tagGr.getValue('name'),
          display_name: tagGr.getDisplayValue('name')
        });
      }
      
      // Initialize search state
      data.search_state = {
        text: '',
        category: '',
        target_tool: '',
        min_rating: 0,
        sort_by: 'name',
        sort_order: 'asc',
        selected_tags: []
      };
      
    })()`,
    css: Now.include('../../../client/service-portal/widgets/prompt-gallery-search/styles.css'),
    option_schema: '[{"name":"search_placeholder","label":"Search Placeholder","type":"string","default_value":"Search prompts, descriptions, or content..."}, {"name":"show_advanced","label":"Show Advanced Filters","type":"boolean","default_value":"true"}, {"name":"show_sorting","label":"Show Sort Options","type":"boolean","default_value":"true"}]',
    demo_data: '{"search_placeholder": "Search prompts...", "show_advanced": "true", "show_sorting": "true"}',
    docs: 'Advanced search widget for the prompt gallery with text search, category filtering, rating filters, tag selection, and sorting options.',
    public: false,
    has_preview: true,
    servicenow: false,
    data_table: 'sp_instance',

    controller_as: 'c'
  }
});