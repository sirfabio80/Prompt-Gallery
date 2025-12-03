// Service layer for Prompt Gallery API operations
export class PromptGalleryService {
  constructor() {
    this.baseHeaders = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-UserToken": window.g_ck
    };
  }

  // Helper method for API calls with error handling
  async apiCall(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.baseHeaders, ...options.headers }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Get all prompts with latest version info and metrics
  async getPrompts(filters = {}) {
    let url = '/api/now/table/x_snc_prompt_galle_prompt?sysparm_display_value=all&sysparm_limit=1000';
    
    // Add filters
    const queries = [];
    if (filters.category && filters.category.trim() !== '') {
      queries.push(`category=${filters.category}`);
    }
    if (filters.isActive !== undefined) {
      queries.push(`is_active=${filters.isActive}`);
    } else {
      queries.push('is_active=true'); // Default to active only
    }
    if (filters.search && filters.search.trim() !== '') {
      const searchTerm = filters.search;
      queries.push(`nameLIKE${searchTerm}^ORshort_descriptionLIKE${searchTerm}`);
    }
    
    if (queries.length > 0) {
      url += `&sysparm_query=${queries.join('^')}`;
    } else {
      url += '&sysparm_query=is_active=true';
    }
    
    url += '&sysparm_order_by=name';
    
    const response = await this.apiCall(url);
    return response.result || [];
  }

  // Get a single prompt with all its versions
  async getPrompt(promptId) {
    const response = await this.apiCall(
      `/api/now/table/x_snc_prompt_galle_prompt/${promptId}?sysparm_display_value=all`
    );
    return response.result;
  }

  // Get all versions for a prompt
  async getPromptVersions(promptId) {
    const response = await this.apiCall(
      `/api/now/table/x_snc_prompt_galle_prompt_version?sysparm_query=prompt=${promptId}&sysparm_display_value=all&sysparm_order_by=version_number`
    );
    return response.result || [];
  }

  // Get latest version for a prompt
  async getLatestVersion(promptId) {
    const response = await this.apiCall(
      `/api/now/table/x_snc_prompt_galle_prompt_version?sysparm_query=prompt=${promptId}&sysparm_display_value=all&sysparm_order_by=DESCversion_number&sysparm_limit=1`
    );
    return response.result?.[0];
  }

  // Create new prompt with first version
  async createPrompt(promptData, versionData) {
    // Create prompt first
    const promptResponse = await this.apiCall('/api/now/table/x_snc_prompt_galle_prompt?sysparm_display_value=all', {
      method: 'POST',
      body: JSON.stringify(promptData)
    });
    
    const prompt = promptResponse.result;
    
    // Create first version
    const versionResponse = await this.apiCall('/api/now/table/x_snc_prompt_galle_prompt_version?sysparm_display_value=all', {
      method: 'POST',
      body: JSON.stringify({
        ...versionData,
        prompt: prompt.sys_id.value,
        version_number: 1
      })
    });
    
    return { prompt, version: versionResponse.result };
  }

  // Create new version from existing one
  async createVersion(promptId, versionData) {
    // Get highest version number
    const versions = await this.getPromptVersions(promptId);
    const maxVersion = Math.max(...versions.map(v => parseInt(v.version_number.value) || 0));
    
    const response = await this.apiCall('/api/now/table/x_snc_prompt_galle_prompt_version?sysparm_display_value=all', {
      method: 'POST',
      body: JSON.stringify({
        ...versionData,
        prompt: promptId,
        version_number: maxVersion + 1
      })
    });
    
    return response.result;
  }

  // Update prompt
  async updatePrompt(promptId, data) {
    const response = await this.apiCall(`/api/now/table/x_snc_prompt_galle_prompt/${promptId}?sysparm_display_value=all`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return response.result;
  }

  // Update version
  async updateVersion(versionId, data) {
    const response = await this.apiCall(`/api/now/table/x_snc_prompt_galle_prompt_version/${versionId}?sysparm_display_value=all`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
    return response.result;
  }

  // Submit rating for a version
  async rateVersion(versionId, rating) {
    // Get current version to update rating_sum and rating_count
    const versionResponse = await this.apiCall(`/api/now/table/x_snc_prompt_galle_prompt_version/${versionId}?sysparm_display_value=all`);
    const version = versionResponse.result;
    
    const currentSum = parseInt(version.rating_sum.value) || 0;
    const currentCount = parseInt(version.rating_count.value) || 0;
    
    const response = await this.apiCall(`/api/now/table/x_snc_prompt_galle_prompt_version/${versionId}?sysparm_display_value=all`, {
      method: 'PATCH',
      body: JSON.stringify({
        rating_sum: currentSum + rating,
        rating_count: currentCount + 1
      })
    });
    
    return response.result;
  }

  // Mark version as used
  async markAsUsed(versionId, usageData = {}) {
    // Create usage record
    const usageResponse = await this.apiCall('/api/now/table/x_snc_prompt_galle_prompt_usage?sysparm_display_value=all', {
      method: 'POST',
      body: JSON.stringify({
        prompt_version: versionId,
        used_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        ...usageData
      })
    });
    
    // Increment usage count on version
    const versionResponse = await this.apiCall(`/api/now/table/x_snc_prompt_galle_prompt_version/${versionId}?sysparm_display_value=all`);
    const version = versionResponse.result;
    const currentUsage = parseInt(version.usage_count.value) || 0;
    
    await this.apiCall(`/api/now/table/x_snc_prompt_galle_prompt_version/${versionId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        usage_count: currentUsage + 1
      })
    });
    
    return usageResponse.result;
  }

  // Get recent usage for a version
  async getVersionUsage(versionId, limit = 5) {
    const response = await this.apiCall(
      `/api/now/table/x_snc_prompt_galle_prompt_usage?sysparm_query=prompt_version=${versionId}&sysparm_display_value=all&sysparm_order_by=DESCused_at&sysparm_limit=${limit}`
    );
    return response.result || [];
  }

  // Get all tags
  async getTags() {
    const response = await this.apiCall('/api/now/table/x_snc_prompt_galle_tag?sysparm_query=is_active=true&sysparm_display_value=all&sysparm_order_by=name');
    return response.result || [];
  }

  // Get all engagements
  async getEngagements() {
    const response = await this.apiCall('/api/now/table/x_snc_prompt_galle_engagement?sysparm_display_value=all&sysparm_order_by=name');
    return response.result || [];
  }

  // Get tags for a prompt
  async getPromptTags(promptId) {
    const response = await this.apiCall(
      `/api/now/table/x_snc_prompt_galle_prompt_tag?sysparm_query=prompt=${promptId}&sysparm_display_value=all`
    );
    return response.result || [];
  }

  // Add tag to prompt
  async addPromptTag(promptId, tagId) {
    const response = await this.apiCall('/api/now/table/x_snc_prompt_galle_prompt_tag?sysparm_display_value=all', {
      method: 'POST',
      body: JSON.stringify({
        prompt: promptId,
        tag: tagId
      })
    });
    return response.result;
  }

  // Remove tag from prompt
  async removePromptTag(promptTagId) {
    await this.apiCall(`/api/now/table/x_snc_prompt_galle_prompt_tag/${promptTagId}`, {
      method: 'DELETE'
    });
  }

  // Search prompts with advanced filtering
  async searchPrompts(searchText, filters = {}) {
    const queries = [];
    
    if (searchText) {
      queries.push(`nameLIKE${searchText}^ORshort_descriptionLIKE${searchText}`);
    }
    
    if (filters.category) {
      queries.push(`category=${filters.category}`);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      // This is complex - would need to join with prompt_tag table
      // For MVP, we'll search by tag names in the UI after getting results
    }
    
    let url = '/api/now/table/x_snc_prompt_galle_prompt?sysparm_display_value=all';
    if (queries.length > 0) {
      url += `&sysparm_query=${queries.join('^')}`;
    }
    url += '&sysparm_order_by=name';
    
    const response = await this.apiCall(url);
    return response.result || [];
  }
}