import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

export const prompt_gallery_detail_widget = Record({
  $id: Now.ID['prompt_gallery_detail_widget'],
  table: 'sp_widget',
  data: {
    id: 'prompt_gallery_detail',
    name: 'Prompt Gallery Detail',
    description: 'Detailed view widget for individual prompts with version management and actions',
    template: Now.include('../../../client/service-portal/widgets/prompt-gallery-detail/template.html'),
    client_script: Now.include('../../../client/service-portal/widgets/prompt-gallery-detail/client.js'),
    script: `(function() {
      // Server script for Prompt Gallery Detail widget
      var promptId = input && input.prompt_id || options.prompt_id;
      
      if (!promptId) {
        data.error = 'Prompt ID is required';
        return;
      }
      
      data.prompt_id = promptId;
      data.current_user = gs.getUserID();
      
      // Handle server actions
      if (input && input.action) {
        handleAction(input.action, input);
      }
      
      // Load prompt details
      loadPromptDetails();
      
      function loadPromptDetails() {
        try {
          // Get prompt record directly
          var promptGr = new GlideRecord('x_snc_prompt_galle_prompt');
          if (!promptGr.get(promptId)) {
            data.error = 'Prompt not found';
            return;
          }
          
          data.prompt = {
            sys_id: promptGr.getUniqueValue(),
            name: promptGr.getValue('name'),
            display_name: promptGr.getDisplayValue('name'),
            short_description: promptGr.getValue('short_description'),
            full_prompt: promptGr.getValue('full_prompt'),
            category: promptGr.getValue('category'),
            category_display: promptGr.getDisplayValue('category'),
            owner_team: promptGr.getValue('owner_team'),
            owner_team_display: promptGr.getDisplayValue('owner_team'),
            is_active: promptGr.getValue('is_active'),
            total_usage_count: promptGr.getValue('total_usage_count') || '0',
            created_at: promptGr.getDisplayValue('sys_created_on'),
            updated_at: promptGr.getDisplayValue('sys_updated_on')
          };
          
          // Debug log the full_prompt content
          gs.info('Debug: full_prompt content length: ' + (data.prompt.full_prompt ? data.prompt.full_prompt.length : 'null'));
          gs.info('Debug: full_prompt preview: ' + (data.prompt.full_prompt ? data.prompt.full_prompt.substring(0, 100) : 'null'));
          
          // Get category details including color
          if (data.prompt.category) {
            var categoryGr = new GlideRecord('x_snc_prompt_galle_category');
            if (categoryGr.get(data.prompt.category)) {
              data.prompt.category_color = categoryGr.getValue('color') || '#667eea';
              data.prompt.category_icon = categoryGr.getValue('icon') || 'folder';
            }
          }
          
          // Set default color if no category
          if (!data.prompt.category_color) {
            data.prompt.category_color = '#667eea';
          }
          
          // Get versions
          data.prompt.versions = [];
          var versionGr = new GlideRecord('x_snc_prompt_galle_prompt_version');
          versionGr.addQuery('prompt', promptId);
          versionGr.orderBy('version_number');
          versionGr.query();
          
          while (versionGr.next()) {
            var ratingSum = parseInt(versionGr.getValue('rating_sum')) || 0;
            var ratingCount = parseInt(versionGr.getValue('rating_count')) || 0;
            var averageRating = ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0;
            
            var version = {
              sys_id: versionGr.getUniqueValue(),
              version_number: versionGr.getValue('version_number'),
              version_display: 'Version ' + versionGr.getValue('version_number'),
              status: versionGr.getValue('status'),
              status_display: versionGr.getDisplayValue('status'),
              is_recommended: versionGr.getValue('status') === 'recommended',
              target_tool: versionGr.getValue('target_tool'),
              target_tool_display: versionGr.getDisplayValue('target_tool'),
              language: versionGr.getValue('language'),
              language_display: versionGr.getDisplayValue('language'),
              role_instructions: versionGr.getValue('role_instructions'),
              prompt_body: versionGr.getValue('prompt_body'),
              example_input: versionGr.getValue('example_input'),
              example_output: versionGr.getValue('example_output'),
              usage_count: versionGr.getValue('usage_count') || '0',
              rating_sum: ratingSum,
              rating_count: ratingCount,
              average_rating: averageRating,
              created_at: versionGr.getDisplayValue('sys_created_on'),
              updated_at: versionGr.getDisplayValue('sys_updated_on')
            };
            
            data.prompt.versions.push(version);
          }
          
          // Get tags
          data.prompt.tags = [];
          var tagGr = new GlideRecord('x_snc_prompt_galle_prompt_tag');
          tagGr.addQuery('prompt', promptId);
          tagGr.query();
          
          while (tagGr.next()) {
            var tagLookupGr = new GlideRecord('x_snc_prompt_galle_tag');
            if (tagLookupGr.get(tagGr.getValue('tag'))) {
              data.prompt.tags.push({
                sys_id: tagLookupGr.getUniqueValue(),
                name: tagLookupGr.getValue('name'),
                display_name: tagLookupGr.getDisplayValue('name'),
                description: tagLookupGr.getValue('description')
              });
            }
          }
          
          // Set recommended version as default
          if (data.prompt.versions && data.prompt.versions.length > 0) {
            var recommendedVersion = null;
            for (var i = 0; i < data.prompt.versions.length; i++) {
              if (data.prompt.versions[i].status === 'recommended') {
                recommendedVersion = data.prompt.versions[i];
                break;
              }
            }
            
            data.selected_version = recommendedVersion || data.prompt.versions[0];
          }
          
        } catch (error) {
          gs.error('Error loading prompt details: ' + error.message);
          data.error = 'Failed to load prompt details: ' + error.message;
        }
      }
      
      function handleAction(action, params) {
        try {
          var api = new PromptGalleryAPI();
          var result;
          
          switch (action) {
            case 'rate_version':
              if (!params.version_id || !params.rating) {
                data.action_result = { success: false, message: 'Version ID and rating are required' };
                return;
              }
              
              api.setParameter('sysparm_version_id', params.version_id);
              api.setParameter('sysparm_rating', params.rating);
              result = api.rateVersion();
              data.action_result = JSON.parse(result);
              
              // Reload prompt details to get updated ratings
              if (data.action_result.success) {
                loadPromptDetails();
              }
              break;
              
            case 'mark_used':
              if (!params.version_id) {
                data.action_result = { success: false, message: 'Version ID is required' };
                return;
              }
              
              api.setParameter('sysparm_version_id', params.version_id);
              if (params.engagement_id) {
                api.setParameter('sysparm_engagement_id', params.engagement_id);
              }
              if (params.context) {
                api.setParameter('sysparm_context', params.context);
              }
              
              result = api.markAsUsed();
              data.action_result = JSON.parse(result);
              
              // Reload prompt details to get updated usage counts
              if (data.action_result.success) {
                loadPromptDetails();
              }
              break;
              
            case 'get_usage':
              if (!params.version_id) {
                data.action_result = { success: false, message: 'Version ID is required' };
                return;
              }
              
              api.setParameter('sysparm_version_id', params.version_id);
              api.setParameter('sysparm_limit', params.limit || '10');
              result = api.getVersionUsage();
              data.usage_history = JSON.parse(result);
              break;
              
            default:
              data.action_result = { success: false, message: 'Unknown action: ' + action };
          }
          
        } catch (error) {
          gs.error('Error handling action ' + action + ': ' + error.message);
          data.action_result = { success: false, message: 'Server error occurred' };
        }
      }
    })()`,
    css: Now.include('../../../client/service-portal/widgets/prompt-gallery-detail/styles.css'),
    option_schema: '[{"name":"prompt_id","label":"Prompt ID","type":"string","description":"ID of the prompt to display"}]',
    demo_data: '{}',
    docs: 'Detailed view widget for individual prompts showing all versions, ratings, usage statistics, and providing interaction capabilities.',
    public: false,
    has_preview: false,
    servicenow: false,
    data_table: 'sp_instance',

    controller_as: 'c'
  }
});