// Enhanced Service layer that works in both UI Page and Service Portal contexts
export class PromptGalleryService {
  constructor(config = {}) {
    this.config = config;
    this.isServicePortal = config.isServicePortal || false;
    
    // Set up appropriate API endpoints based on context
    if (this.isServicePortal) {
      // In Service Portal, we'll use GlideAjax to call our Script Include
      this.apiBase = '/api/x_snc_prompt_galle/prompt_gallery_api';
      this.useGlideAjax = true;
    } else {
      // In UI Pages, use the direct Table API
      this.apiBase = '/api/now/table';
      this.useGlideAjax = false;
    }
    
    this.baseHeaders = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
    
    // Add user token if available
    if (typeof window !== 'undefined' && window.g_ck) {
      this.baseHeaders["X-UserToken"] = window.g_ck;
    }
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

  // GlideAjax call for Service Portal context
  async glideAjaxCall(method, params = {}) {
    return new Promise((resolve, reject) => {
      try {
        var ga = new GlideAjax('PromptGalleryAPI');
        ga.addParam('sysparm_name', method);
        
        // Add all parameters
        Object.keys(params).forEach(key => {
          ga.addParam('sysparm_' + key, params[key]);
        });
        
        ga.getXML(function(response) {
          try {
            var result = response.responseXML.documentElement.getAttribute('answer');
            var parsed = JSON.parse(result);
            
            if (parsed.error) {
              reject(new Error(parsed.message || 'API Error'));
            } else {
              resolve(parsed);
            }
          } catch (parseError) {
            reject(new Error('Failed to parse server response'));
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Get all prompts with latest version info and metrics
  async getPrompts(filters = {}) {
    if (this.useGlideAjax) {
      return await this.glideAjaxCall('getPromptsWithMetrics', filters);
    } else {
      // Use existing Table API logic for UI Pages
      let url = `${this.apiBase}/x_snc_prompt_galle_prompt?sysparm_display_value=all&sysparm_limit=1000`;
      
      const queries = [];
      if (filters.category) {
        queries.push(`category=${filters.category}`);
      }
      if (filters.isActive !== undefined) {
        queries.push(`is_active=${filters.isActive}`);
      }
      if (filters.search) {
        queries.push(`nameLIKE${filters.search}^ORshort_descriptionLIKE${filters.search}`);
      }
      
      if (queries.length > 0) {
        url += `&sysparm_query=${queries.join('^')}`;
      }
      
      url += '&sysparm_order_by=name';
      
      const response = await this.apiCall(url);
      return response.result || [];
    }
  }

  // Get a single prompt with all its versions
  async getPrompt(promptId) {
    if (this.useGlideAjax) {
      return await this.glideAjaxCall('getPromptDetails', { prompt_id: promptId });
    } else {
      const response = await this.apiCall(
        `${this.apiBase}/x_snc_prompt_galle_prompt/${promptId}?sysparm_display_value=all`
      );
      return response.result;
    }
  }

  // Get all versions for a prompt
  async getPromptVersions(promptId) {
    if (this.useGlideAjax) {
      return await this.glideAjaxCall('getPromptVersions', { prompt_id: promptId });
    } else {
      const response = await this.apiCall(
        `${this.apiBase}/x_snc_prompt_galle_prompt_version?sysparm_query=prompt=${promptId}&sysparm_display_value=all&sysparm_order_by=version_number`
      );
      return response.result || [];
    }
  }

  // Submit rating for a version
  async rateVersion(versionId, rating) {
    if (this.useGlideAjax) {
      return await this.glideAjaxCall('rateVersion', { version_id: versionId, rating: rating });
    } else {
      // Use existing Table API logic for UI Pages
      const versionResponse = await this.apiCall(`${this.apiBase}/x_snc_prompt_galle_prompt_version/${versionId}?sysparm_display_value=all`);
      const version = versionResponse.result;
      
      const currentSum = parseInt(version.rating_sum.value) || 0;
      const currentCount = parseInt(version.rating_count.value) || 0;
      
      const response = await this.apiCall(`${this.apiBase}/x_snc_prompt_galle_prompt_version/${versionId}?sysparm_display_value=all`, {
        method: 'PATCH',
        body: JSON.stringify({
          rating_sum: currentSum + rating,
          rating_count: currentCount + 1
        })
      });
      
      return response.result;
    }
  }

  // Mark version as used
  async markAsUsed(versionId, usageData = {}) {
    if (this.useGlideAjax) {
      return await this.glideAjaxCall('markAsUsed', { 
        version_id: versionId, 
        engagement_id: usageData.engagement,
        context: usageData.context 
      });
    } else {
      // Use existing Table API logic for UI Pages
      const usageResponse = await this.apiCall(`${this.apiBase}/x_snc_prompt_galle_prompt_usage?sysparm_display_value=all`, {
        method: 'POST',
        body: JSON.stringify({
          prompt_version: versionId,
          used_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
          ...usageData
        })
      });
      
      const versionResponse = await this.apiCall(`${this.apiBase}/x_snc_prompt_galle_prompt_version/${versionId}?sysparm_display_value=all`);
      const version = versionResponse.result;
      const currentUsage = parseInt(version.usage_count.value) || 0;
      
      await this.apiCall(`${this.apiBase}/x_snc_prompt_galle_prompt_version/${versionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          usage_count: currentUsage + 1
        })
      });
      
      return usageResponse.result;
    }
  }

  // Get recent usage for a version
  async getVersionUsage(versionId, limit = 5) {
    if (this.useGlideAjax) {
      return await this.glideAjaxCall('getVersionUsage', { version_id: versionId, limit: limit });
    } else {
      const response = await this.apiCall(
        `${this.apiBase}/x_snc_prompt_galle_prompt_usage?sysparm_query=prompt_version=${versionId}&sysparm_display_value=all&sysparm_order_by=DESCused_at&sysparm_limit=${limit}`
      );
      return response.result || [];
    }
  }

  // Get all tags
  async getTags() {
    if (this.useGlideAjax) {
      return await this.glideAjaxCall('getTags');
    } else {
      const response = await this.apiCall(`${this.apiBase}/x_snc_prompt_galle_tag?sysparm_query=is_active=true&sysparm_display_value=all&sysparm_order_by=name`);
      return response.result || [];
    }
  }

  // Get all engagements
  async getEngagements() {
    if (this.useGlideAjax) {
      return await this.glideAjaxCall('getEngagements');
    } else {
      const response = await this.apiCall(`${this.apiBase}/x_snc_prompt_galle_engagement?sysparm_display_value=all&sysparm_order_by=name`);
      return response.result || [];
    }
  }

  // Get tags for a prompt
  async getPromptTags(promptId) {
    const response = await this.apiCall(
      `${this.apiBase}/x_snc_prompt_galle_prompt_tag?sysparm_query=prompt=${promptId}&sysparm_display_value=all`
    );
    return response.result || [];
  }

  // Search prompts with advanced filtering
  async searchPrompts(searchText, filters = {}) {
    return await this.getPrompts({ 
      search: searchText, 
      ...filters 
    });
  }
}