import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const prompt_gallery_edit_widget = Record({
    $id: Now.ID['prompt_gallery_edit_widget'],
    table: 'sp_widget',
    data: {
        id: 'prompt_gallery_edit',
        name: 'Prompt Gallery Edit',
        description: 'Widget for editing prompt details and content',
        template: Now.include('../../../client/service-portal/widgets/prompt-gallery-edit/template.html'),
        client_script: Now.include('../../../client/service-portal/widgets/prompt-gallery-edit/client.js'),
        script: `(function() {
      // Get prompt ID from URL parameters or widget input
      var promptId = $sp.getParameter('sys_id') || options.prompt_id;
      
      if (!promptId) {
        data.error = 'No prompt ID provided';
        return;
      }
      
      // Initialize data
      data.prompt_id = promptId;
      data.prompt = null;
      data.categories = [];
      data.teams = [];
      data.success_message = '';
      data.error_message = '';
      
      // Load prompt data
      function loadPromptData() {
        try {
          // Get the prompt record
          var promptGR = new GlideRecord('x_snc_prompt_galle_prompt');
          if (promptGR.get(promptId)) {
            data.prompt = {
              sys_id: promptGR.getUniqueValue(),
              name: promptGR.getValue('name'),
              short_description: promptGR.getValue('short_description'),
              full_prompt: promptGR.getValue('full_prompt'),
              category: promptGR.getValue('category'),
              owner_team: promptGR.getValue('owner_team'),
              is_active: promptGR.getValue('is_active') == 'true' || promptGR.getValue('is_active') === true || promptGR.getValue('is_active') == true
            };
          } else {
            data.error = 'Prompt not found';
            return;
          }
        } catch (e) {
          data.error = 'Error loading prompt: ' + e.message;
          return;
        }
      }
      
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
      if (input && input.action === 'update_prompt') {
        try {
          var promptGR = new GlideRecord('x_snc_prompt_galle_prompt');
          if (promptGR.get(promptId)) {
            // Validate required fields
            if (!input.name || input.name.trim() === '') {
              data.error_message = 'Name is required';
              return;
            }
            
            if (!input.full_prompt || input.full_prompt.trim() === '') {
              data.error_message = 'Full prompt content is required';
              return;
            }
            
            // Update the record
            promptGR.setValue('name', input.name.trim());
            promptGR.setValue('short_description', input.short_description || '');
            promptGR.setValue('full_prompt', input.full_prompt);
            promptGR.setValue('category', input.category || '');
            promptGR.setValue('owner_team', input.owner_team || '');
            promptGR.setValue('is_active', input.is_active === true || input.is_active === 'true');
            
            if (promptGR.update()) {
              data.success_message = 'Prompt updated successfully!';
              // Reload the updated data
              loadPromptData();
            } else {
              data.error_message = 'Failed to update prompt';
            }
          } else {
            data.error_message = 'Prompt not found';
          }
        } catch (e) {
          data.error_message = 'Error updating prompt: ' + e.message;
        }
      }
      
      // Initialize data on load
      loadPromptData();
      loadCategories(); 
      loadTeams();
    })();`,
        css: Now.include('../../../client/service-portal/widgets/prompt-gallery-edit/styles.css'),
        option_schema: '[{"name":"prompt_id","label":"Prompt ID","type":"string"}]',
        demo_data: '{"prompt_id": ""}',
        docs: 'Widget for editing prompt detail',
        public: false,
        has_preview: true,
        servicenow: false,
        data_table: 'sp_instance',
        controller_as: 'c',
        internal: false,
    },
})
