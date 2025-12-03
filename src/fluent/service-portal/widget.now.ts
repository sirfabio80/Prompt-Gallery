import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';
import { prompt_viewer } from '../roles/roles.now.ts';

// Service Portal Widget for Prompt Gallery
Record({
  $id: Now.ID['prompt_gallery_sp_widget'],
  table: 'sp_widget',
  data: {
    id: 'prompt_gallery_widget',
    name: 'Prompt Gallery Widget',
    description: 'React-based widget for browsing and interacting with the Prompt Gallery',
    template: Now.include('../../client/service-portal/prompt-gallery-widget.html'),
    client_script: Now.include('../../client/service-portal/prompt-gallery-client.js'),
    server_script: `(function() {
      // Server script for Prompt Gallery widget
      
      // Initialize data
      data.current_user = gs.getUser().getID();
      data.user_roles = [];
      
      // Get user roles for access control
      var userRoles = gs.getUser().getRoles();
      if (userRoles) {
        data.user_roles = userRoles.toArray();
      }
      
      // Handle server calls from client
      if (input && input.action === 'server_call') {
        handleServerCall(input.method, input.params);
      }
      
      function handleServerCall(method, params) {
        try {
          var api = new PromptGalleryAPI();
          var result;
          
          switch (method) {
            case 'getPrompts':
              // Set parameters for the API call
              if (params.search) api.setParameter('sysparm_search', params.search);
              if (params.category) api.setParameter('sysparm_category', params.category);
              
              result = api.getPromptsWithMetrics();
              break;
              
            case 'getPromptDetails':
              api.setParameter('sysparm_prompt_id', params.promptId);
              result = api.getPromptDetails();
              break;
              
            case 'rateVersion':
              api.setParameter('sysparm_version_id', params.versionId);
              api.setParameter('sysparm_rating', params.rating);
              result = api.rateVersion();
              break;
              
            case 'markAsUsed':
              api.setParameter('sysparm_version_id', params.versionId);
              if (params.engagementId) api.setParameter('sysparm_engagement_id', params.engagementId);
              if (params.context) api.setParameter('sysparm_context', params.context);
              result = api.markAsUsed();
              break;
              
            case 'getTags':
              result = api.getTags();
              break;
              
            case 'getEngagements':
              result = api.getEngagements();
              break;
              
            default:
              result = JSON.stringify({ error: true, message: 'Unknown method: ' + method });
          }
          
          // Send response back to client
          data.server_response = {
            success: true,
            data: JSON.parse(result)
          };
          
        } catch (error) {
          gs.error('PromptGalleryWidget error in ' + method + ': ' + error.message);
          data.server_response = {
            success: false,
            error: error.message
          };
        }
      }
    })()`,
    css: '',
    option_schema: '[]',
    demo_data: '{}',
    docs: 'Widget for displaying the Prompt Gallery in Service Portal. Provides full functionality including browsing, searching, rating, and marking prompts as used.',
    roles: [prompt_viewer],
    public: false,
    has_preview: false,
    servicenow: false,
    data_table: '',
    script: ''
  }
});