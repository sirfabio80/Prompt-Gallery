// Service Portal Widget Client Controller for Prompt Gallery
function PromptGalleryWidgetController($scope, $rootScope) {
  var c = this;
  
  // Initialize widget
  c.$onInit = function() {
    // Wait for DOM to be ready, then bootstrap React
    $scope.$evalAsync(function() {
      c.initializeReactApp();
    });
  };
  
  c.initializeReactApp = function() {
    // Import and bootstrap the React app
    import('/x_snc_prompt_galle_gallery.do').then(function() {
      // The main.jsx should be available globally after the import
      if (window.PromptGalleryApp) {
        c.mountReactApp();
      } else {
        // Fallback: try to load the React components directly
        c.loadReactComponents();
      }
    }).catch(function(error) {
      c.showError('Failed to load Prompt Gallery. Please refresh the page.');
    });
  };
  
  c.mountReactApp = function() {
    var container = document.getElementById('prompt-gallery-sp-root');
    if (container && window.React && window.ReactDOM) {
      try {
        var root = window.ReactDOM.createRoot(container);
        root.render(
          window.React.createElement(window.React.StrictMode, null,
            window.React.createElement(window.PromptGalleryApp || window.App, {
              config: window.PROMPT_GALLERY_CONFIG,
              servicePortalMode: true
            })
          )
        );
      } catch (error) {
        c.showError('Error initializing Prompt Gallery interface.');
      }
    } else {
      c.showError('React dependencies not loaded properly.');
    }
  };
  
  c.loadReactComponents = function() {
    // Alternative approach: Create a custom API service for Service Portal context
    var container = document.getElementById('prompt-gallery-sp-root');
    if (!container) return;
    
    // Create a Service Portal-specific API service
    var servicePortalAPI = c.createServicePortalAPI();
    
    // Create a basic implementation that works in Service Portal context
    container.innerHTML = `
      <div class="prompt-gallery-sp">
        <div class="search-section" style="margin-bottom: 20px;">
          <div class="row">
            <div class="col-md-8">
              <input type="text" class="form-control" id="prompt-search" 
                     placeholder="Search prompts..." 
                     onkeyup="c.handleSearch(event)">
            </div>
            <div class="col-md-4">
              <select class="form-control" id="category-filter" onchange="c.handleCategoryFilter(event)">
                <option value="">All Categories</option>
                <option value="content_creation">Content Creation</option>
                <option value="code_generation">Code Generation</option>
                <option value="data_analysis">Data Analysis</option>
                <option value="problem_solving">Problem Solving</option>
              </select>
            </div>
          </div>
        </div>
        <div id="prompts-container" class="row">
          <div class="col-12 text-center">
            <div class="loading-spinner"></div>
            <p>Loading prompts...</p>
          </div>
        </div>
      </div>
    `;
    
    // Load the initial data
    c.loadPrompts();
  };
  
  c.createServicePortalAPI = function() {
    return {
      getPrompts: function(filters) {
        return c.callServer('getPrompts', filters);
      },
      getPromptDetails: function(promptId) {
        return c.callServer('getPromptDetails', { promptId: promptId });
      },
      rateVersion: function(versionId, rating) {
        return c.callServer('rateVersion', { versionId: versionId, rating: rating });
      },
      markAsUsed: function(versionId, usageData) {
        return c.callServer('markAsUsed', Object.assign({ versionId: versionId }, usageData));
      }
    };
  };
  
  c.callServer = function(method, params) {
    return new Promise(function(resolve, reject) {
      var serverParams = Object.assign({ method: method }, params);
      
      $rootScope.data = $rootScope.data || {};
      $rootScope.data.serverParams = serverParams;
      
      $rootScope.$emit('sp.update', {
        action: 'server_call',
        method: method,
        params: params
      });
      
      // Listen for server response
      var deregister = $rootScope.$on('sp.server_response', function(event, response) {
        deregister();
        if (response.success) {
          resolve(response.data);
        } else {
          reject(response.error);
        }
      });
    });
  };
  
  c.loadPrompts = function(filters) {
    filters = filters || {};
    
    c.callServer('getPrompts', filters).then(function(prompts) {
      c.renderPrompts(prompts);
    }).catch(function(error) {
      c.showError('Failed to load prompts.');
    });
  };
  
  c.renderPrompts = function(prompts) {
    var container = document.getElementById('prompts-container');
    if (!container) return;
    
    if (prompts.length === 0) {
      container.innerHTML = `
        <div class="col-12 text-center">
          <p class="text-muted">No prompts found matching your criteria.</p>
        </div>
      `;
      return;
    }
    
    var html = '';
    prompts.forEach(function(prompt) {
      var latestVersion = prompt.latest_version;
      var averageRating = latestVersion ? (latestVersion.average_rating || 0) : 0;
      var usageCount = latestVersion ? (latestVersion.usage_count || 0) : 0;
      
      html += `
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="prompt-card card h-100" onclick="c.showPromptDetail('${prompt.sys_id}')" style="cursor: pointer;">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title text-primary-sn">${prompt.name}</h5>
                <span class="category-badge">${prompt.category_display || prompt.category}</span>
              </div>
              <p class="card-text text-muted small">${prompt.short_description}</p>
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="rating-stars">
                    ${c.renderStars(averageRating)}
                  </div>
                  <small class="text-muted">${usageCount} uses</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  };
  
  c.renderStars = function(rating) {
    var fullStars = Math.floor(rating);
    var halfStar = rating % 1 >= 0.5;
    var emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    var html = '';
    
    // Full stars
    for (var i = 0; i < fullStars; i++) {
      html += '<i class="fa fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
      html += '<i class="fa fa-star-half-o"></i>';
    }
    
    // Empty stars
    for (var j = 0; j < emptyStars; j++) {
      html += '<i class="fa fa-star-o"></i>';
    }
    
    return html;
  };
  
  c.showPromptDetail = function(promptId) {
    // For Service Portal, we'll show details in a modal or navigate to a detail view
    // For now, let's create a simple modal approach
    c.callServer('getPromptDetails', { promptId: promptId }).then(function(prompt) {
      c.openPromptModal(prompt);
    }).catch(function(error) {
      c.showError('Failed to load prompt details.');
    });
  };
  
  c.openPromptModal = function(prompt) {
    // Create a modal with prompt details
    var modalHtml = c.buildPromptModal(prompt);
    
    // Remove existing modal
    var existingModal = document.getElementById('prompt-detail-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    // Add new modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show modal
    var modal = document.getElementById('prompt-detail-modal');
    if (modal && window.$ && window.$.fn.modal) {
      window.$(modal).modal('show');
    }
  };
  
  c.buildPromptModal = function(prompt) {
    var versions = prompt.versions || [];
    var recommendedVersion = versions.find(function(v) { return v.is_recommended; }) || versions[0];
    
    if (!recommendedVersion) {
      return '<div>No version data available</div>';
    }
    
    return `
      <div class="modal fade" id="prompt-detail-modal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-primary-sn">${prompt.name}</h5>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
              <div class="prompt-detail-content">
                <p class="text-muted">${prompt.short_description}</p>
                
                <div class="row mb-3">
                  <div class="col-md-6">
                    <strong>Category:</strong> ${prompt.category_display || prompt.category}
                  </div>
                  <div class="col-md-6">
                    <strong>Version:</strong> ${recommendedVersion.version_number}
                    ${recommendedVersion.is_recommended ? '<span class="badge badge-success ml-1">Recommended</span>' : ''}
                  </div>
                </div>
                
                <div class="version-content mb-4">
                  <h6>Role/Instructions:</h6>
                  <div class="bg-light p-3 rounded mb-3">
                    <pre style="white-space: pre-wrap; margin: 0;">${recommendedVersion.role_instructions}</pre>
                  </div>
                  
                  <h6>Prompt:</h6>
                  <div class="bg-light p-3 rounded mb-3">
                    <pre style="white-space: pre-wrap; margin: 0;">${recommendedVersion.prompt_body}</pre>
                  </div>
                  
                  ${recommendedVersion.example_input ? `
                    <h6>Example Input:</h6>
                    <div class="bg-light p-3 rounded mb-3">
                      <pre style="white-space: pre-wrap; margin: 0;">${recommendedVersion.example_input}</pre>
                    </div>
                  ` : ''}
                  
                  ${recommendedVersion.example_output ? `
                    <h6>Example Output:</h6>
                    <div class="bg-light p-3 rounded mb-3">
                      <pre style="white-space: pre-wrap; margin: 0;">${recommendedVersion.example_output}</pre>
                    </div>
                  ` : ''}
                </div>
                
                <div class="action-section">
                  <div class="row">
                    <div class="col-md-8">
                      <button class="btn btn-primary-sn" onclick="c.copyPromptToClipboard('${recommendedVersion.sys_id}')">
                        <i class="fa fa-copy"></i> Copy Prompt
                      </button>
                      <button class="btn btn-success ml-2" onclick="c.markVersionAsUsed('${recommendedVersion.sys_id}')">
                        <i class="fa fa-check"></i> Mark as Used
                      </button>
                    </div>
                    <div class="col-md-4 text-right">
                      <div class="rating-section">
                        <span>Rate this version:</span>
                        <div class="rating-stars mt-1" id="rating-${recommendedVersion.sys_id}">
                          ${c.renderInteractiveStars(recommendedVersion.sys_id, recommendedVersion.average_rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  c.renderInteractiveStars = function(versionId, currentRating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      var filled = i <= Math.floor(currentRating);
      html += `<i class="fa ${filled ? 'fa-star' : 'fa-star-o'}" 
                  onclick="c.rateVersion('${versionId}', ${i})"
                  onmouseover="c.highlightStars('${versionId}', ${i})"
                  onmouseout="c.resetStars('${versionId}', ${currentRating})"></i>`;
    }
    return html;
  };
  
  c.copyPromptToClipboard = function(versionId) {
    // This is a simplified version - in a full implementation, 
    // you'd get the full prompt text and copy it
    alert('Copy functionality would copy the full prompt to clipboard');
  };
  
  c.markVersionAsUsed = function(versionId) {
    c.callServer('markAsUsed', { versionId: versionId }).then(function(result) {
      if (result.success) {
        alert('Marked as used successfully!');
      }
    }).catch(function(error) {
      alert('Failed to mark as used.');
    });
  };
  
  c.rateVersion = function(versionId, rating) {
    c.callServer('rateVersion', { versionId: versionId, rating: rating }).then(function(result) {
      if (result.success) {
        // Update the display
        c.resetStars(versionId, result.new_average);
        alert('Rating submitted successfully!');
      }
    }).catch(function(error) {
      alert('Failed to submit rating.');
    });
  };
  
  c.highlightStars = function(versionId, rating) {
    var container = document.getElementById('rating-' + versionId);
    if (!container) return;
    
    var stars = container.querySelectorAll('i.fa');
    stars.forEach(function(star, index) {
      if (index < rating) {
        star.className = 'fa fa-star';
      } else {
        star.className = 'fa fa-star-o';
      }
    });
  };
  
  c.resetStars = function(versionId, rating) {
    var container = document.getElementById('rating-' + versionId);
    if (!container) return;
    
    var stars = container.querySelectorAll('i.fa');
    stars.forEach(function(star, index) {
      if (index < Math.floor(rating)) {
        star.className = 'fa fa-star';
      } else {
        star.className = 'fa fa-star-o';
      }
    });
  };
  
  c.handleSearch = function(event) {
    if (event.key === 'Enter' || event.type === 'blur') {
      var searchText = event.target.value;
      var categoryFilter = document.getElementById('category-filter').value;
      
      c.loadPrompts({
        search: searchText,
        category: categoryFilter
      });
    }
  };
  
  c.handleCategoryFilter = function(event) {
    var category = event.target.value;
    var searchText = document.getElementById('prompt-search').value;
    
    c.loadPrompts({
      search: searchText,
      category: category
    });
  };
  
  c.showError = function(message) {
    var container = document.getElementById('prompt-gallery-sp-root');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <i class="fa fa-exclamation-triangle"></i> ${message}
        </div>
      `;
    }
  };
  
  // Make methods available globally for onclick handlers
  window.c = c;
}