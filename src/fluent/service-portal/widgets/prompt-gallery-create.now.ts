import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const prompt_gallery_create_widget = Record({
    $id: Now.ID['prompt_gallery_create_widget'],
    table: 'sp_widget',
    data: {
        id: 'prompt_gallery_create',
        name: 'Prompt Gallery Create',
        description: 'Widget for creating new prompt records',
        template: Now.include('../../../client/service-portal/widgets/prompt-gallery-create/template.html'),
        client_script: Now.include('../../../client/service-portal/widgets/prompt-gallery-create/client.js'),
        script: `(function() {
      // Initialize data model first
      data.prompt = {
        name: '',
        short_description: '',
        full_prompt: '',
        category: '',
        owner_team: '',
        is_active: true
      };
      data.categories = [];
      data.teams = [];
      data.success_message = '';
      data.error_message = '';
      
      // Initialize service using correct scoped namespace
      var promptService = null;
      try {
        promptService = new x_snc_prompt_galle.PromptGalleryService();
      } catch (e) {
        gs.error('Error initializing PromptGalleryService: ' + e.message);
        data.error_message = 'Service initialization failed. Please contact administrator.';
      }
      
      // Handle form submission
      if (input && input.action === 'create_prompt') {
        try {
          if (!promptService) {
            data.error_message = 'Service not available. Please contact administrator.';
            return;
          }
          
          var promptData = {
            name: input.name,
            short_description: input.short_description,
            full_prompt: input.full_prompt,
            category: input.category,
            owner_team: input.owner_team,
            is_active: input.is_active
          };
          
          gs.info('Creating prompt with data: ' + JSON.stringify(promptData));
          var result = promptService.createPrompt(promptData);
          gs.info('PromptGalleryService.createPrompt result: ' + JSON.stringify(result));
          
          if (result && result.success) {
            data.success_message = 'Prompt created successfully!';
            data.created_prompt_id = result.sys_id;
            
            // Reset form data
            data.prompt = {
              name: '',
              short_description: '',
              full_prompt: '',
              category: '',
              owner_team: '',
              is_active: true
            };
          } else {
            data.error_message = result.error_message || 'Failed to create prompt. Please try again.';
            gs.error('Prompt creation failed: ' + (result.error_message || 'Unknown error'));
          }
        } catch (e) {
          data.error_message = 'Error creating prompt: ' + e.message;
          gs.error('Prompt creation error in widget: ' + e.message);
        }
      }
      
      // Load initial data - categories and teams
      try {
        if (promptService) {
          data.categories = promptService.getCategories();
          data.teams = promptService.getTeams();
          gs.info('Loaded categories: ' + data.categories.length + ', teams: ' + data.teams.length);
        } else {
          gs.error('Cannot load dropdown data - service not available');
          data.error_message = 'Cannot load form data - service not available.';
        }
      } catch (e) {
        gs.error('Error loading dropdown data in widget: ' + e.message);
        data.error_message = 'Error loading form data. Please refresh the page.';
      }
    })();`,
        css: Now.include('../../../client/service-portal/widgets/prompt-gallery-create/styles.css'),
        option_schema: '[]',
        demo_data: '{}',
        docs: 'Widget for creating new prompt records in the Prompt Gallery',
        public: false,
        has_preview: true,
        servicenow: false,
        data_table: 'sp_instance',
        controller_as: 'c',
        internal: false,
    },
})