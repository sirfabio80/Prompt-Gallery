import { gs } from '@servicenow/glide';
import { GlideRecord } from '@servicenow/glide';
import { GlideAggregate } from '@servicenow/glide';
import { JSON } from '@servicenow/glide';

var PromptGalleryAPI = Class.create();

PromptGalleryAPI.prototype = Object.extendsObject(global.AbstractAjaxProcessor, {
  
  /**
   * Get all prompts with latest version info and aggregated metrics
   */
  getPromptsWithMetrics: function() {
    var filters = this._parseFilters();
    var prompts = [];
    
    var gr = new GlideRecord('x_snc_prompt_galle_prompt');
    gr.addQuery('is_active', true);
    
    // Add search filter if provided
    if (filters.search) {
      var qc = gr.addQuery('name', 'CONTAINS', filters.search);
      qc.addOrCondition('short_description', 'CONTAINS', filters.search);
    }
    
    // Add category filter if provided
    if (filters.category) {
      gr.addQuery('category', filters.category);
    }
    
    gr.orderBy('name');
    gr.query();
    
    while (gr.next()) {
      var prompt = this._buildPromptObject(gr);
      
      // Get latest version info
      var latestVersion = this._getLatestVersion(gr.getUniqueValue());
      if (latestVersion) {
        prompt.latest_version = latestVersion;
      }
      
      prompts.push(prompt);
    }
    
    return JSON.stringify(prompts);
  },
  
  /**
   * Get a single prompt with all its versions
   */
  getPromptDetails: function() {
    var promptId = this.getParameter('sysparm_prompt_id');
    if (!promptId) {
      return this._errorResponse('Prompt ID is required');
    }
    
    var gr = new GlideRecord('x_snc_prompt_galle_prompt');
    if (!gr.get(promptId)) {
      return this._errorResponse('Prompt not found');
    }
    
    var prompt = this._buildPromptObject(gr);
    
    // Get all versions
    prompt.versions = this._getPromptVersions(promptId);
    
    // Get tags
    prompt.tags = this._getPromptTags(promptId);
    
    return JSON.stringify(prompt);
  },
  
  /**
   * Get all versions for a specific prompt
   */
  getPromptVersions: function() {
    var promptId = this.getParameter('sysparm_prompt_id');
    if (!promptId) {
      return this._errorResponse('Prompt ID is required');
    }
    
    var versions = this._getPromptVersions(promptId);
    return JSON.stringify(versions);
  },
  
  /**
   * Submit a rating for a prompt version
   */
  rateVersion: function() {
    var versionId = this.getParameter('sysparm_version_id');
    var rating = parseInt(this.getParameter('sysparm_rating'));
    
    if (!versionId || !rating || rating < 1 || rating > 5) {
      return this._errorResponse('Valid version ID and rating (1-5) are required');
    }
    
    var gr = new GlideRecord('x_snc_prompt_galle_prompt_version');
    if (!gr.get(versionId)) {
      return this._errorResponse('Version not found');
    }
    
    // Update rating aggregates
    var currentSum = parseInt(gr.getValue('rating_sum')) || 0;
    var currentCount = parseInt(gr.getValue('rating_count')) || 0;
    
    gr.setValue('rating_sum', currentSum + rating);
    gr.setValue('rating_count', currentCount + 1);
    gr.update();
    
    // Calculate new average
    var newAverage = (currentSum + rating) / (currentCount + 1);
    
    return JSON.stringify({
      success: true,
      new_average: Math.round(newAverage * 10) / 10,
      rating_count: currentCount + 1
    });
  },
  
  /**
   * Mark a prompt version as used
   */
  markAsUsed: function() {
    var versionId = this.getParameter('sysparm_version_id');
    var engagementId = this.getParameter('sysparm_engagement_id');
    var context = this.getParameter('sysparm_context') || '';
    
    if (!versionId) {
      return this._errorResponse('Version ID is required');
    }
    
    // Create usage record
    var usageGr = new GlideRecord('x_snc_prompt_galle_prompt_usage');
    usageGr.initialize();
    usageGr.setValue('prompt_version', versionId);
    usageGr.setValue('used_by', gs.getUserID());
    
    if (engagementId) {
      usageGr.setValue('engagement', engagementId);
    }
    if (context) {
      usageGr.setValue('context', context);
    }
    
    var usageId = usageGr.insert();
    
    if (usageId) {
      // Increment usage count on version
      var versionGr = new GlideRecord('x_snc_prompt_galle_prompt_version');
      if (versionGr.get(versionId)) {
        var currentUsage = parseInt(versionGr.getValue('usage_count')) || 0;
        versionGr.setValue('usage_count', currentUsage + 1);
        versionGr.update();
        
        return JSON.stringify({
          success: true,
          usage_count: currentUsage + 1
        });
      }
    }
    
    return this._errorResponse('Failed to record usage');
  },
  
  /**
   * Get recent usage for a version
   */
  getVersionUsage: function() {
    var versionId = this.getParameter('sysparm_version_id');
    var limit = parseInt(this.getParameter('sysparm_limit')) || 5;
    
    if (!versionId) {
      return this._errorResponse('Version ID is required');
    }
    
    var usage = [];
    var gr = new GlideRecord('x_snc_prompt_galle_prompt_usage');
    gr.addQuery('prompt_version', versionId);
    gr.orderByDesc('used_at');
    gr.setLimit(limit);
    gr.query();
    
    while (gr.next()) {
      usage.push({
        sys_id: gr.getUniqueValue(),
        used_by: gr.getDisplayValue('used_by'),
        used_at: gr.getDisplayValue('used_at'),
        engagement: gr.getDisplayValue('engagement'),
        context: gr.getValue('context')
      });
    }
    
    return JSON.stringify(usage);
  },
  
  /**
   * Get all available tags
   */
  getTags: function() {
    var tags = [];
    var gr = new GlideRecord('x_snc_prompt_galle_tag');
    gr.addQuery('is_active', true);
    gr.orderBy('name');
    gr.query();
    
    while (gr.next()) {
      tags.push({
        sys_id: gr.getUniqueValue(),
        name: gr.getValue('name'),
        display_name: gr.getDisplayValue('name'),
        description: gr.getValue('description')
      });
    }
    
    return JSON.stringify(tags);
  },
  
  /**
   * Get all available engagements
   */
  getEngagements: function() {
    var engagements = [];
    var gr = new GlideRecord('x_snc_prompt_galle_engagement');
    gr.orderBy('name');
    gr.query();
    
    while (gr.next()) {
      engagements.push({
        sys_id: gr.getUniqueValue(),
        name: gr.getValue('name'),
        display_name: gr.getDisplayValue('name'),
        description: gr.getValue('description')
      });
    }
    
    return JSON.stringify(engagements);
  },
  
  // Helper methods
  _parseFilters: function() {
    return {
      search: this.getParameter('sysparm_search') || '',
      category: this.getParameter('sysparm_category') || '',
      isActive: this.getParameter('sysparm_is_active') || 'true'
    };
  },
  
  _buildPromptObject: function(gr) {
    return {
      sys_id: gr.getUniqueValue(),
      name: gr.getValue('name'),
      display_name: gr.getDisplayValue('name'),
      short_description: gr.getValue('short_description'),
      full_prompt: gr.getValue('full_prompt'),  // HTML content - preserve as-is
      category: gr.getValue('category'),
      category_display: gr.getDisplayValue('category'),
      owner_team: gr.getValue('owner_team'),
      owner_team_display: gr.getDisplayValue('owner_team'),
      is_active: gr.getValue('is_active'),
      total_usage_count: gr.getValue('total_usage_count') || '0',
      created_at: gr.getDisplayValue('sys_created_on'),
      updated_at: gr.getDisplayValue('sys_updated_on')
    };
  },
  
  _getLatestVersion: function(promptId) {
    var gr = new GlideRecord('x_snc_prompt_galle_prompt_version');
    gr.addQuery('prompt', promptId);
    gr.orderByDesc('version_number');
    gr.setLimit(1);
    gr.query();
    
    if (gr.next()) {
      return this._buildVersionObject(gr);
    }
    return null;
  },
  
  _getPromptVersions: function(promptId) {
    var versions = [];
    var gr = new GlideRecord('x_snc_prompt_galle_prompt_version');
    gr.addQuery('prompt', promptId);
    gr.orderBy('version_number');
    gr.query();
    
    while (gr.next()) {
      versions.push(this._buildVersionObject(gr));
    }
    
    return versions;
  },
  
  _buildVersionObject: function(gr) {
    var ratingSum = parseInt(gr.getValue('rating_sum')) || 0;
    var ratingCount = parseInt(gr.getValue('rating_count')) || 0;
    var averageRating = ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : 0;
    
    return {
      sys_id: gr.getUniqueValue(),
      version_number: gr.getValue('version_number'),
      status: gr.getValue('status'),
      status_display: gr.getDisplayValue('status'),
      is_recommended: gr.getValue('is_recommended') === 'true',
      target_tool: gr.getValue('target_tool'),
      target_tool_display: gr.getDisplayValue('target_tool'),
      language: gr.getValue('language'),
      language_display: gr.getDisplayValue('language'),
      role_instructions: gr.getValue('role_instructions'),
      prompt_body: gr.getValue('prompt_body'),
      example_input: gr.getValue('example_input'),
      example_output: gr.getValue('example_output'),
      usage_count: gr.getValue('usage_count') || '0',
      rating_sum: ratingSum,
      rating_count: ratingCount,
      average_rating: averageRating,
      created_at: gr.getDisplayValue('sys_created_on'),
      updated_at: gr.getDisplayValue('sys_updated_on')
    };
  },
  
  _getPromptTags: function(promptId) {
    var tags = [];
    var gr = new GlideRecord('x_snc_prompt_galle_prompt_tag');
    gr.addQuery('prompt', promptId);
    gr.query();
    
    while (gr.next()) {
      var tagGr = new GlideRecord('x_snc_prompt_galle_tag');
      if (tagGr.get(gr.getValue('tag'))) {
        tags.push({
          sys_id: tagGr.getUniqueValue(),
          name: tagGr.getValue('name'),
          display_name: tagGr.getDisplayValue('name'),
          description: tagGr.getValue('description')
        });
      }
    }
    
    return tags;
  },
  
  _errorResponse: function(message) {
    return JSON.stringify({
      error: true,
      message: message
    });
  },
  
  type: 'PromptGalleryAPI'
});