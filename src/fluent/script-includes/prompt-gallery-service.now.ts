import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const prompt_gallery_service = Record({
    $id: Now.ID['prompt_gallery_service'],
    table: 'sys_script_include',
    data: {
        name: 'PromptGalleryService',
        api_name: 'PromptGalleryService',
        script: `var PromptGalleryService = Class.create();
PromptGalleryService.prototype = {
    initialize: function() {
        this.TABLE_PROMPT = 'x_snc_prompt_galle_prompt';
        this.TABLE_PROMPT_VERSION = 'x_snc_prompt_galle_prompt_version';
        this.TABLE_CATEGORY = 'x_snc_prompt_galle_category';
        this.TABLE_USER_GROUP = 'sys_user_group';
    },

    /**
     * Get categories for dropdown
     * @returns {Array} Array of category objects
     */
    getCategories: function() {
        var categories = [];
        try {
            var categoryGR = new GlideRecord(this.TABLE_CATEGORY);
            categoryGR.addActiveQuery();
            categoryGR.orderBy('name');
            categoryGR.setLimit(100); // Performance safeguard
            categoryGR.query();
            
            while (categoryGR.next()) {
                categories.push({
                    sys_id: categoryGR.getUniqueValue(),
                    name: categoryGR.getValue('name'),
                    label: categoryGR.getValue('display_name') || categoryGR.getDisplayValue('name'),
                    display_name: categoryGR.getValue('display_name'),
                    color: categoryGR.getValue('color')
                });
            }
        } catch (e) {
            gs.error('PromptGalleryService.getCategories error: ' + e.message);
        }
        return categories;
    },

    /**
     * Get teams/user groups for dropdown
     * @returns {Array} Array of team objects
     */
    getTeams: function() {
        var teams = [];
        try {
            var teamGR = new GlideRecord(this.TABLE_USER_GROUP);
            teamGR.addActiveQuery();
            teamGR.orderBy('name');
            teamGR.setLimit(200); // Performance safeguard
            teamGR.query();
            
            while (teamGR.next()) {
                teams.push({
                    sys_id: teamGR.getUniqueValue(),
                    name: teamGR.getValue('name'),
                    label: teamGR.getDisplayValue('name')
                });
            }
        } catch (e) {
            gs.error('PromptGalleryService.getTeams error: ' + e.message);
        }
        return teams;
    },

    /**
     * Validate prompt data before creation
     * @param {Object} promptData - Prompt data to validate
     * @returns {Object} Validation result with isValid boolean and errors array
     */
    validatePromptData: function(promptData) {
        var result = {
            isValid: true,
            errors: []
        };

        // Required field validation
        if (!promptData.name || promptData.name.trim() === '') {
            result.errors.push('Name is required');
            result.isValid = false;
        }

        if (!promptData.full_prompt || promptData.full_prompt.trim() === '') {
            result.errors.push('Full prompt content is required');
            result.isValid = false;
        }

        if (!promptData.category || promptData.category.trim() === '') {
            result.errors.push('Category is required');
            result.isValid = false;
        }

        // Length validation
        if (promptData.name && promptData.name.length > 100) {
            result.errors.push('Name must be 100 characters or less');
            result.isValid = false;
        }

        if (promptData.short_description && promptData.short_description.length > 1000) {
            result.errors.push('Short description must be 1000 characters or less');
            result.isValid = false;
        }

        return result;
    },

    /**
     * Check if prompt name already exists
     * @param {String} name - Prompt name to check
     * @returns {Boolean} True if name exists, false otherwise
     */
    isPromptNameExists: function(name) {
        if (!name || name.trim() === '') return false;
        
        try {
            var existingGR = new GlideRecord(this.TABLE_PROMPT);
            existingGR.addQuery('name', name.trim());
            existingGR.query();
            return existingGR.hasNext();
        } catch (e) {
            gs.error('PromptGalleryService.isPromptNameExists error: ' + e.message);
            return false;
        }
    },

    /**
     * Create a new prompt with initial version
     * @param {Object} promptData - Prompt data
     * @returns {Object} Result with success boolean, sys_id if successful, or error message
     */
    createPrompt: function(promptData) {
        var result = {
            success: false,
            error_message: '',
            sys_id: null
        };

        try {
            // Validate input data
            var validation = this.validatePromptData(promptData);
            if (!validation.isValid) {
                result.error_message = validation.errors.join('; ');
                return result;
            }

            // Check for duplicate name
            if (this.isPromptNameExists(promptData.name)) {
                result.error_message = 'A prompt with this name already exists. Please choose a different name.';
                return result;
            }

            // Create prompt record
            var promptGR = new GlideRecord(this.TABLE_PROMPT);
            promptGR.initialize();
            promptGR.setValue('name', promptData.name.trim());
            promptGR.setValue('short_description', promptData.short_description || '');
            promptGR.setValue('full_prompt', promptData.full_prompt);
            promptGR.setValue('category', promptData.category);
            promptGR.setValue('owner_team', promptData.owner_team || '');
            promptGR.setValue('is_active', promptData.is_active === true || promptData.is_active === 'true');
            promptGR.setValue('created_by', gs.getUserID());
            promptGR.setValue('created_on', new GlideDateTime());
            promptGR.setValue('latest_version_number', 1);
            promptGR.setValue('total_usage_count', 0);
            
            var newPromptSysId = promptGR.insert();
            
            if (newPromptSysId) {
                // Create initial version record
                var versionResult = this._createPromptVersion(newPromptSysId, promptData.full_prompt);
                if (versionResult.success) {
                    result.success = true;
                    result.sys_id = newPromptSysId;
                } else {
                    // Rollback - delete the prompt if version creation failed
                    promptGR.deleteRecord();
                    result.error_message = 'Failed to create prompt version: ' + versionResult.error_message;
                }
            } else {
                result.error_message = 'Failed to create prompt record. Please try again.';
            }
        } catch (e) {
            result.error_message = 'Error creating prompt: ' + e.message;
            gs.error('PromptGalleryService.createPrompt error: ' + e.message);
        }

        return result;
    },

    /**
     * Create initial version record for a prompt (private method)
     * @param {String} promptSysId - Prompt sys_id
     * @param {String} promptBody - Prompt content
     * @returns {Object} Result object
     */
    _createPromptVersion: function(promptSysId, promptBody) {
        var result = {
            success: false,
            error_message: ''
        };

        try {
            var versionGR = new GlideRecord(this.TABLE_PROMPT_VERSION);
            versionGR.initialize();
            versionGR.setValue('prompt', promptSysId);
            versionGR.setValue('version_number', 1);
            versionGR.setValue('prompt_body', promptBody);
            versionGR.setValue('status', 'recommended');
            versionGR.setValue('created_by', gs.getUserID());
            versionGR.setValue('created_on', new GlideDateTime());
            
            var versionSysId = versionGR.insert();
            if (versionSysId) {
                result.success = true;
            } else {
                result.error_message = 'Failed to insert version record';
            }
        } catch (e) {
            result.error_message = 'Exception in version creation: ' + e.message;
            gs.error('PromptGalleryService._createPromptVersion error: ' + e.message);
        }

        return result;
    },

    type: 'PromptGalleryService'
};`,
        description: 'Server-only service for managing Prompt Gallery operations including CRUD operations for prompts, categories, and teams',
        active: true,
        accessible_from: 'all',
        client_callable: false
    },
})