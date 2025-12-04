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
      // Initialize data
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
      
      // Load categories
      function loadCategories() {
        try {
          var categoryGR = new GlideRecord('x_snc_prompt_galle_category');
          categoryGR.addActiveQuery();
          categoryGR.orderBy('name');
          categoryGR.query();
          
          data.categories = [];
          while (categoryGR.next()) {
            data.categories.push({
              sys_id: categoryGR.getUniqueValue(),
              name: categoryGR.getValue('name'),
              label: categoryGR.getValue('display_name') || categoryGR.getDisplayValue('name'),
              display_name: categoryGR.getValue('display_name'),
              color: categoryGR.getValue('color')
            });
          }
        } catch (e) {
          gs.warn('Error loading categories: ' + e.message);
        }
      }
      
      // Load teams
      function loadTeams() {
        try {
          var teamGR = new GlideRecord('sys_user_group');
          teamGR.addActiveQuery();
          teamGR.orderBy('name');
          teamGR.query();
          
          data.teams = [];
          while (teamGR.next()) {
            data.teams.push({
              sys_id: teamGR.getUniqueValue(),
              name: teamGR.getValue('name'),
              label: teamGR.getDisplayValue('name')
            });
          }
        } catch (e) {
          gs.warn('Error loading teams: ' + e.message);
        }
      }
      
      // Handle form submission
      if (input && input.action === 'create_prompt') {
        try {
          // Validate required fields
          if (!input.name || input.name.trim() === '') {
            data.error_message = 'Name is required';
            return;
          }
          
          if (!input.full_prompt || input.full_prompt.trim() === '') {
            data.error_message = 'Full prompt content is required';
            return;
          }
          
          if (!input.category || input.category.trim() === '') {
            data.error_message = 'Category is required';
            return;
          }
          
          // Check for duplicate name
          var existingPromptGR = new GlideRecord('x_snc_prompt_galle_prompt');
          existingPromptGR.addQuery('name', input.name.trim());
          existingPromptGR.query();
          if (existingPromptGR.hasNext()) {
            data.error_message = 'A prompt with this name already exists. Please choose a different name.';
            return;
          }
          
          // Create new prompt record
          var promptGR = new GlideRecord('x_snc_prompt_galle_prompt');
          promptGR.initialize();
          promptGR.setValue('name', input.name.trim());
          promptGR.setValue('short_description', input.short_description || '');
          promptGR.setValue('full_prompt', input.full_prompt);
          promptGR.setValue('category', input.category);
          promptGR.setValue('owner_team', input.owner_team || '');
          promptGR.setValue('is_active', input.is_active === true || input.is_active === 'true');
          promptGR.setValue('created_by', gs.getUserID());
          promptGR.setValue('created_on', new GlideDateTime());
          promptGR.setValue('latest_version_number', 1);
          promptGR.setValue('total_usage_count', 0);
          
          var newPromptSysId = promptGR.insert();
          
          if (newPromptSysId) {
            // Create initial version record
            var versionGR = new GlideRecord('x_snc_prompt_galle_prompt_version');
            versionGR.initialize();
            versionGR.setValue('prompt', newPromptSysId);
            versionGR.setValue('version_number', 1);
            versionGR.setValue('prompt_body', input.full_prompt);
            versionGR.setValue('status', 'recommended');
            versionGR.setValue('created_by', gs.getUserID());
            versionGR.setValue('created_on', new GlideDateTime());
            versionGR.insert();
            
            data.success_message = 'Prompt created successfully!';
            data.created_prompt_id = newPromptSysId;
            
            // Reset form
            data.prompt = {
              name: '',
              short_description: '',
              full_prompt: '',
              category: '',
              owner_team: '',
              is_active: true
            };
          } else {
            data.error_message = 'Failed to create prompt. Please try again.';
          }
        } catch (e) {
          data.error_message = 'Error creating prompt: ' + e.message;
          gs.error('Prompt creation error: ' + e.message);
        }
      }
      
      // Initialize data on load
      loadCategories();
      loadTeams();
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