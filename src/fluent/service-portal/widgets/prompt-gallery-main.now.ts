import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const prompt_gallery_main_widget = Record({
    $id: Now.ID['prompt_gallery_main_widget'],
    table: 'sp_widget',
    data: {
        id: 'prompt_gallery_main',
        name: 'Prompt Gallery Main',
        description: 'Main widget for browsing and searching prompts in the gallery',
        template: Now.include('../../../client/service-portal/widgets/prompt-gallery-main/template.html'),
        client_script: Now.include('../../../client/service-portal/widgets/prompt-gallery-main/client.js'),
        script: `(function() {
  try {
    // Initialize data object
    data.error = null;
    
    // Widget options with defaults
    data.title = options.title || 'Prompt Gallery';
    data.show_search = options.show_search !== 'false';
    data.show_categories = options.show_categories !== 'false';
    data.items_per_page = parseInt(options.items_per_page) || 9;
    data.current_user = gs.getUserID();
    
    data.page = 1;
    
    // Process other input parameters
    var searchText = (input && input.search_text) || '';
    var categoryFilter = (input && input.category_filter) || '';
    var targetToolFilter = (input && input.target_tool_filter) || '';
    var minRatingFilter = parseFloat((input && input.min_rating_filter) || 0) || 0;
    var tagsFilter = (input && input.tags_filter) || [];
    var sortBy = (input && input.sort_by) || 'name';
    var sortOrder = (input && input.sort_order) || 'asc';
    
    // Load categories
    data.categories = [];
    var catGr = new GlideRecord('x_snc_prompt_galle_category');
    catGr.addQuery('is_active', true);
    catGr.orderBy('sequence');
    catGr.orderBy('display_name');
    catGr.query();
    
    while (catGr.next()) {
      data.categories.push({
        value: catGr.getUniqueValue(),  // Use sys_id as value for filtering
        label: catGr.getValue('display_name'),
        name: catGr.getValue('name'),   // Keep name for reference
        description: catGr.getValue('description'),
        icon: catGr.getValue('icon'),
        color: catGr.getValue('color'),
        prompt_count: catGr.getValue('prompt_count') || 0
      });
    }
    
    // Simplified function - just get active prompts, client will filter
    function applyBasicFilters(gr) {
      gr.addQuery('is_active', true);
      // Client-side filtering will handle category, search, etc.
    }
    
    // Helper function to apply sorting
    function applySorting(gr) {
      switch (sortBy) {
        case 'name':
          sortOrder === 'desc' ? gr.orderByDesc('name') : gr.orderBy('name');
          break;
        case 'created':
          sortOrder === 'desc' ? gr.orderByDesc('sys_created_on') : gr.orderBy('sys_created_on');
          break;
        case 'updated':
          sortOrder === 'desc' ? gr.orderByDesc('sys_updated_on') : gr.orderBy('sys_updated_on');
          break;
        case 'usage':
          sortOrder === 'desc' ? gr.orderByDesc('total_usage_count') : gr.orderBy('total_usage_count');
          break;
        default:
          gr.orderBy('name');
      }
      // Secondary sort for consistent ordering across pages
      gr.orderBy('sys_id');
    }
    
    // Get total count (all active prompts - client will filter)
    var countGr = new GlideRecord('x_snc_prompt_galle_prompt');
    applyBasicFilters(countGr);
    countGr.query();
    data.total_count = countGr.getRowCount();
    
    // No pagination needed - get all prompts for client-side filtering
    data.total_pages = 1;
    data.current_page = 1;
    
    // Get ALL prompts for client-side filtering
    var allPromptsGr = new GlideRecord('x_snc_prompt_galle_prompt');
    applyBasicFilters(allPromptsGr);
    applySorting(allPromptsGr);
    allPromptsGr.query();
    
    var currentPrompts = [];
    while (allPromptsGr.next()) {
      
      // Get category information
      var categoryId = allPromptsGr.getValue('category');
      var categoryDisplayName = 'Uncategorized';
      var categoryIcon = 'folder';
      var categoryColor = '#6B7280';
      
      if (categoryId) {
        var catLookup = new GlideRecord('x_snc_prompt_galle_category');
        if (catLookup.get(categoryId)) {
          categoryDisplayName = catLookup.getValue('display_name') || catLookup.getValue('name') || 'Uncategorized';
          categoryIcon = catLookup.getValue('icon') || 'folder';
          categoryColor = catLookup.getValue('color') || '#6B7280';
        }
      }
      
      var prompt = {
        sys_id: allPromptsGr.getUniqueValue(),
        name: allPromptsGr.getValue('name'),
        short_description: allPromptsGr.getValue('short_description'),
        full_prompt: allPromptsGr.getValue('full_prompt'),
        category: categoryId,
        category_display: categoryDisplayName,
        category_icon: categoryIcon,
        category_color: categoryColor,
        total_usage_count: allPromptsGr.getValue('total_usage_count') || '0',
        created_at: allPromptsGr.getDisplayValue('sys_created_on'),
        updated_at: allPromptsGr.getDisplayValue('sys_updated_on')
      };
      
      // Get latest version info
      var versionGr = new GlideRecord('x_snc_prompt_galle_prompt_version');
      versionGr.addQuery('prompt', allPromptsGr.getUniqueValue());
      versionGr.orderByDesc('version_number');
      versionGr.setLimit(1);
      versionGr.query();
      
      if (versionGr.next()) {
        var ratingSum = parseInt(versionGr.getValue('rating_sum')) || 0;
        var ratingCount = parseInt(versionGr.getValue('rating_count')) || 0;
        var averageRating = ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0;
        
        prompt.latest_version = {
          sys_id: versionGr.getUniqueValue(),
          version_number: versionGr.getValue('version_number'),
          status: versionGr.getValue('status'),
          target_tool: versionGr.getValue('target_tool'),
          target_tool_display: versionGr.getDisplayValue('target_tool'),
          role_instructions: versionGr.getValue('role_instructions'),
          prompt_body: versionGr.getValue('prompt_body'),
          usage_count: versionGr.getValue('usage_count') || '0',
          rating_sum: ratingSum,
          rating_count: ratingCount,
          average_rating: averageRating
        };
      } else {
        prompt.latest_version = {
          sys_id: '',
          version_number: '0',
          usage_count: '0',
          average_rating: 0,
          rating_count: 0
        };
      }
      
      currentPrompts.push(prompt);
    }
    // Set response data - all prompts for client filtering
    data.prompts = currentPrompts;
    data.current_page = 1;
    data.total_pages = 1;
    
    // Handle usage tracking
    if (input && input.track_usage && input.version_id && input.context) {
      var usageGr = new GlideRecord('x_snc_prompt_galle_prompt_usage');
      usageGr.initialize();
      usageGr.setValue('prompt_version', input.version_id);
      usageGr.setValue('user', gs.getUserID());
      usageGr.setValue('context', input.context);
      usageGr.setValue('usage_date', gs.nowDateTime());
      usageGr.insert();
      
      var versionUpdateGr = new GlideRecord('x_snc_prompt_galle_prompt_version');
      if (versionUpdateGr.get(input.version_id)) {
        var currentUsage = parseInt(versionUpdateGr.getValue('usage_count')) || 0;
        versionUpdateGr.setValue('usage_count', currentUsage + 1);
        versionUpdateGr.update();
      }
    }
    
  } catch (error) {
    gs.error('Prompt Gallery Main widget error: ' + error.message);
    gs.error('Error stack: ' + error.stack);
    data.error = 'Unable to load prompts. Please try again later.';
    data.prompts = [];
    data.categories = [];
    data.total_count = 0;
    data.total_pages = 1;
    data.current_page = 1;
  }
})()`,
        css: Now.include('../../../client/service-portal/widgets/prompt-gallery-main/styles.css'),
        option_schema:
            '[{"name":"title","label":"Title","type":"string","default_value":"Prompt Gallery"}, {"name":"show_search","label":"Show Search","type":"boolean","default_value":"true"}, {"name":"show_categories","label":"Show Categories","type":"boolean","default_value":"true"}, {"name":"items_per_page","label":"Items Per Page","type":"string","default_value":"9"}]',
        demo_data:
            '{"title": "Prompt Gallery", "show_search": "true", "show_categories": "true", "items_per_page": "9"}',
        docs: 'Main widget for displaying the p',
        public: false,
        has_preview: true,
        servicenow: false,
        data_table: 'sp_instance',

        controller_as: 'c',
        internal: false,
    },
})
