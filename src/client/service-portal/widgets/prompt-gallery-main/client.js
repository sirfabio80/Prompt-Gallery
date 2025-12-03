api.controller = function PromptGalleryMainController($scope, $timeout, spModal, spUtil, $location) {
  var c = this;
  
  // Controller properties
  c.prompts = [];
  c.searchText = '';
  c.selectedCategory = '';
  c.isLoading = false;
  c.error = null;
  c.currentSearchParams = null;
  c.currentPage = 1;
  c.totalPages = 1;
  c.totalCount = 0;
  c.starCache = {};

  // Initialize from server data
  c.init = function() {
    // Store all prompts for filtering
    c.allPrompts = angular.copy($scope.data.prompts || []);
    c.currentPage = 1; // Start at page 1
    c.currentSearchParams = {}; // No initial search
    
    if ($scope.data && $scope.data.error) {
      c.error = $scope.data.error;
    } else {
      // Apply initial filtering and pagination
      c.applyFiltersAndPagination();
    }
  };

  // Apply client-side filtering and pagination
  c.applyFiltersAndPagination = function() {
    // Start with all prompts
    var filteredPrompts = angular.copy(c.allPrompts || []);
    
    // Apply client-side filtering
    if (c.currentSearchParams) {
      // Filter by category if specified
      if (c.currentSearchParams.category) {
        var categoryFilter = c.currentSearchParams.category;
        
        filteredPrompts = filteredPrompts.filter(function(prompt) {
          return prompt.category === categoryFilter;
        });
      }
      
      // Filter by search text if specified
      if (c.currentSearchParams.text) {
        var searchText = c.currentSearchParams.text.toLowerCase();
        
        filteredPrompts = filteredPrompts.filter(function(prompt) {
          return prompt.name.toLowerCase().includes(searchText) ||
                 (prompt.short_description && prompt.short_description.toLowerCase().includes(searchText)) ||
                 (prompt.full_prompt && prompt.full_prompt.toLowerCase().includes(searchText));
        });
      }
      
      // Filter by target tool if specified
      if (c.currentSearchParams.target_tool) {
        var toolFilter = c.currentSearchParams.target_tool;
        
        filteredPrompts = filteredPrompts.filter(function(prompt) {
          return prompt.latest_version && prompt.latest_version.target_tool === toolFilter;
        });
      }
      
      // Filter by minimum rating if specified
      if (c.currentSearchParams.min_rating > 0) {
        var minRating = c.currentSearchParams.min_rating;
        
        filteredPrompts = filteredPrompts.filter(function(prompt) {
          return prompt.latest_version && prompt.latest_version.average_rating >= minRating;
        });
      }
      
      // Apply sorting
      if (c.currentSearchParams.sort_by) {
        var sortBy = c.currentSearchParams.sort_by;
        var sortOrder = c.currentSearchParams.sort_order || 'asc';
        
        filteredPrompts.sort(function(a, b) {
          var aVal, bVal;
          
          switch (sortBy) {
            case 'name':
              aVal = a.name.toLowerCase();
              bVal = b.name.toLowerCase();
              break;
            case 'created':
              aVal = new Date(a.created_at);
              bVal = new Date(b.created_at);
              break;
            case 'updated':
              aVal = new Date(a.updated_at);
              bVal = new Date(b.updated_at);
              break;
            case 'usage':
              aVal = parseInt(a.total_usage_count) || 0;
              bVal = parseInt(b.total_usage_count) || 0;
              break;
            default:
              aVal = a.name.toLowerCase();
              bVal = b.name.toLowerCase();
          }
          
          if (sortOrder === 'desc') {
            return aVal > bVal ? -1 : (aVal < bVal ? 1 : 0);
          } else {
            return aVal < bVal ? -1 : (aVal > bVal ? 1 : 0);
          }
        });
      }
    }
    
    // Store filtered results (all pages)
    c.filteredPrompts = filteredPrompts;
    c.totalCount = filteredPrompts.length;
    
    // Calculate pagination
    var itemsPerPage = $scope.data.items_per_page || 9;
    c.totalPages = Math.max(1, Math.ceil(c.totalCount / itemsPerPage));
    
    // Ensure current page is within bounds
    if (c.currentPage > c.totalPages) {
      c.currentPage = c.totalPages;
    }
    if (c.currentPage < 1) {
      c.currentPage = 1;
    }
    
    // Apply pagination - get current page of results
    var startIndex = (c.currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    c.prompts = filteredPrompts.slice(startIndex, endIndex);
  };

  // Navigate to specific page
  c.goToPage = function(page) {
    if (page < 1 || page > c.totalPages || page === c.currentPage) {
      return; // Invalid page or same page
    }
    
    c.currentPage = page;
    
    // Reapply pagination to show new page
    c.applyFiltersAndPagination();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  c.previousPage = function() {
    c.goToPage(c.currentPage - 1);
  };
  
  c.nextPage = function() {
    c.goToPage(c.currentPage + 1);
  };
  
  // Generate visible page numbers for pagination UI
  c.getVisiblePages = function() {
    var pages = [];
    var maxVisible = 5;
    
    if (c.totalPages <= maxVisible) {
      for (var i = 1; i <= c.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      var start = Math.max(2, c.currentPage - 1);
      var end = Math.min(c.totalPages - 1, c.currentPage + 1);
      
      if (start > 2) {
        pages.push('ellipsis-start');
      }
      
      for (var j = start; j <= end; j++) {
        if (j !== 1 && j !== c.totalPages) {
          pages.push(j);
        }
      }
      
      if (end < c.totalPages - 1) {
        pages.push('ellipsis-end');
      }
      
      if (c.totalPages > 1) {
        pages.push(c.totalPages);
      }
    }
    
    return pages;
  };

  // Search functionality
  c.performSearch = function(searchParams) {
    c.isLoading = true;
    c.error = null;
    c.currentSearchParams = searchParams || {};
    c.currentPage = 1; // Reset to first page when searching
    
    // Clear URL page parameter for new search
    $location.search('p', null);
    
    // Send minimal request to server - we only need all prompts once
    var serverParams = {
      _t: Date.now() // Just refresh the data
    };
    
    $scope.server.update(serverParams).then(function(response) {
      // Store all prompts for filtering and pagination
      c.allPrompts = angular.copy($scope.data.prompts || []);
      
      // Apply filtering and pagination
      c.applyFiltersAndPagination();
      
      c.isLoading = false;
    }).catch(function(error) {
      console.error('Search failed:', error);
      c.error = 'Failed to search prompts. Please try again.';
      c.isLoading = false;
    });
  };

  c.clearFilters = function() {
    c.searchText = '';
    c.selectedCategory = '';
    c.currentSearchParams = null;
    c.performSearch({});
  };

  c.getCategoryLabel = function(categoryValue) {
    if (!categoryValue || !$scope.data.categories) return '';
    var category = $scope.data.categories.find(function(cat) {
      return cat.value === categoryValue;  // Now matching by sys_id
    });
    return category ? category.label : categoryValue;
  };

  c.getStars = function(rating) {
    if (!rating) return [];
    var cacheKey = String(rating);
    if (c.starCache[cacheKey]) return c.starCache[cacheKey];
    
    var stars = [];
    var fullStars = Math.floor(rating);
    var hasHalfStar = (rating % 1) >= 0.5;
    var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (var i = 0; i < fullStars; i++) stars.push({ class: 'fa-star' });
    if (hasHalfStar) stars.push({ class: 'fa-star-half-o' });
    for (var j = 0; j < emptyStars; j++) stars.push({ class: 'fa-star-o' });
    
    c.starCache[cacheKey] = stars;
    return stars;
  };

  // Copy functionality - updated with robust logic from detail widget
  c.copyPrompt = function(prompt, event) {
    if (event) event.stopPropagation();
    if (!prompt || !prompt.latest_version) {
      spUtil.addInfoMessage('No version available to copy');
      return;
    }

    var promptText = '';
    if (prompt.latest_version.role_instructions && prompt.latest_version.role_instructions.trim()) {
      promptText += prompt.latest_version.role_instructions.trim() + '\n\n';
    }
    if (prompt.latest_version.prompt_body && prompt.latest_version.prompt_body.trim()) {
      promptText += prompt.latest_version.prompt_body.trim();
    }

    // Fall back to full_prompt if version content is not available
    if (!promptText.trim() && prompt.full_prompt) {
      var fullPromptContent = prompt.full_prompt;
      // Strip HTML tags if present
      if (fullPromptContent.indexOf('<') !== -1) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullPromptContent;
        promptText = tempDiv.textContent || tempDiv.innerText || '';
      } else {
        promptText = fullPromptContent;
      }
    }

    if (!promptText.trim()) {
      spUtil.addErrorMessage('No prompt content available to copy.');
      return;
    }

    // Use modern clipboard API with fallback
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(promptText).then(function() {
        spUtil.addInfoMessage('Prompt copied to clipboard!');
        c.trackUsage(prompt.latest_version.sys_id, 'quick_copy');
      }).catch(function(err) {
        console.log('Clipboard API failed, using fallback:', err);
        c.fallbackCopy(promptText, prompt.latest_version.sys_id);
      });
    } else {
      c.fallbackCopy(promptText, prompt.latest_version.sys_id);
    }
  };

  // Improved fallback copy method
  c.fallbackCopy = function(text, versionId) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      var successful = document.execCommand('copy');
      if (successful) {
        spUtil.addInfoMessage('Prompt copied to clipboard!');
        if (versionId) c.trackUsage(versionId, 'quick_copy');
      } else {
        spUtil.addErrorMessage('Failed to copy to clipboard. Please copy manually.');
      }
    } catch (err) {
      console.error('Copy command failed:', err);
      spUtil.addErrorMessage('Copy not supported. Please copy manually.');
    }
    
    document.body.removeChild(textArea);
  };

  c.openPrompt = function(prompt, event) {
    if (event) event.stopPropagation();
    if (!prompt) return;
    spModal.open({
      title: prompt.name,
      widget: 'prompt_gallery_detail',
      widgetInput: { prompt_id: prompt.sys_id },
      size: 'lg',
      footerStyle: { display: 'none' },
      backdrop: true,
      keyboard: true
    });
  };

  c.trackUsage = function(versionId, context) {
    if (!versionId) return;
    $scope.server.update({
      track_usage: true,
      version_id: versionId,
      context: context
    });
  };

  c.retry = function() {
    c.error = null;
    c.isLoading = true;
    $scope.server.update({ page: 1, _t: Date.now() }).then(function() {
      c.prompts = angular.copy($scope.data.prompts || []);
      c.currentPage = $scope.data.current_page || 1;
      c.totalPages = $scope.data.total_pages || 1;
      c.totalCount = $scope.data.total_count || 0;
      c.isLoading = false;
    }).catch(function() {
      c.error = 'Failed to load prompts.';
      c.isLoading = false;
    });
  };

  // Listen for search events from search widget
  var searchListener = $scope.$on('prompt.search', function(event, searchParams) {
    c.performSearch(searchParams);
  });

  // Listen for external search requests
  var searchRequestListener = $scope.$on('prompt.search.request', function(event, searchText) {
    if (searchText !== undefined) {
      c.performSearch({ text: searchText });
    }
  });

  // Listen for filter reset requests
  var filterResetListener = $scope.$on('prompt.filters.reset', function() {
    c.clearFilters();
  });

  // Clean up event listeners on widget destroy
  $scope.$on('$destroy', function() {
    searchListener();
    searchRequestListener();
    filterResetListener();
  });

  // Check URL for page parameter on init
  var urlPage = parseInt($location.search().p) || 1;
  if (urlPage > 1) {
    $scope.data.requested_page = urlPage;
  }

  // Initialize
  c.init();
};