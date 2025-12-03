function PromptGallerySearchController($scope, $rootScope, $timeout) {
  var c = this;

  // Initialize controller
  c.$onInit = function() {
    c.searchState = angular.copy($scope.data.search_state) || {
      text: '',
      category: '',
      target_tool: '',
      min_rating: 0,
      sort_by: 'name',
      sort_order: 'asc',
      selected_tags: []
    };
    
    c.showAdvanced = false;
    c.isSearching = false;
    c.sortOption = c.searchState.sort_by + '_' + c.searchState.sort_order;
    
    // Initialize tag selections
    c.initializeTags();
    
    // Debounce timer for search-as-you-type
    c.searchDebounceTimer = null;
  };

  // Initialize tag selections based on search state
  c.initializeTags = function() {
    if ($scope.data.available_tags && c.searchState.selected_tags) {
      angular.forEach($scope.data.available_tags, function(tag) {
        tag.selected = c.searchState.selected_tags.indexOf(tag.sys_id) !== -1;
      });
    }
  };

  // Toggle advanced filters panel
  c.toggleAdvancedFilters = function() {
    c.showAdvanced = !c.showAdvanced;
  };

  // Handle search input change (with debouncing)
  c.onSearchChange = function() {
    if (c.searchDebounceTimer) {
      $timeout.cancel(c.searchDebounceTimer);
    }
    
    c.searchDebounceTimer = $timeout(function() {
      c.performSearch();
    }, 500); // 500ms delay
  };

  // Handle filter changes
  c.onFilterChange = function() {
    c.clearCache();
    c.performSearch();
  };

  // Handle sort changes
  c.onSortChange = function() {
    if (c.sortOption) {
      var parts = c.sortOption.split('_');
      c.searchState.sort_by = parts[0];
      c.searchState.sort_order = parts[1];
      c.clearCache();
      c.performSearch();
    }
  };

  // Handle tag selection
  c.onTagChange = function(tag) {
    c.updateSelectedTags();
    c.clearCache();
    c.performSearch();
  };

  // Update selected tags array
  c.updateSelectedTags = function() {
    c.searchState.selected_tags = [];
    
    angular.forEach($scope.data.available_tags, function(tag) {
      if (tag.selected) {
        c.searchState.selected_tags.push(tag.sys_id);
      }
    });
  };

  // Get selected tags objects (cached to prevent infinite digest)
  c.getSelectedTags = function() {
    if (c.cache.selectedTags !== null) {
      return c.cache.selectedTags;
    }
    
    if (!$scope.data.available_tags) {
      c.cache.selectedTags = [];
      return [];
    }
    
    var selectedTags = $scope.data.available_tags.filter(function(tag) {
      return tag.selected;
    });
    
    c.cache.selectedTags = selectedTags;
    return selectedTags;
  };

  // Remove a specific tag
  c.removeTag = function(tagToRemove) {
    tagToRemove.selected = false;
    c.updateSelectedTags();
    c.clearCache();
    c.performSearch();
  };

  // Clear a specific filter
  c.clearFilter = function(filterName) {
    switch (filterName) {
      case 'text':
        c.searchState.text = '';
        break;
      case 'category':
        c.searchState.category = '';
        break;
      case 'target_tool':
        c.searchState.target_tool = '';
        break;
      case 'min_rating':
        c.searchState.min_rating = 0;
        break;
      case 'tags':
        angular.forEach($scope.data.available_tags, function(tag) {
          tag.selected = false;
        });
        c.updateSelectedTags();
        break;
    }
    c.clearCache();
    c.performSearch();
  };

  // Clear all filters
  c.clearAllFilters = function() {
    c.searchState = {
      text: '',
      category: '',
      target_tool: '',
      min_rating: 0,
      sort_by: 'name',
      sort_order: 'asc',
      selected_tags: []
    };
    
    c.sortOption = 'name_asc';
    
    // Clear tag selections
    angular.forEach($scope.data.available_tags, function(tag) {
      tag.selected = false;
    });
    
    c.clearCache();
    c.performSearch();
  };

  // Cache for preventing infinite digest loops
  c.cache = {
    selectedTags: null,
    hasActiveFilters: null,
    categoryLabels: {},
    toolLabels: {},
    ratingStars: {}
  };

  // Check if any filters are active (cached to prevent infinite digest)
  c.hasActiveFilters = function() {
    if (c.cache.hasActiveFilters !== null) {
      return c.cache.hasActiveFilters;
    }
    
    var hasFilters = c.searchState.text ||
           c.searchState.category ||
           c.searchState.target_tool ||
           c.searchState.min_rating > 0 ||
           (c.searchState.selected_tags && c.searchState.selected_tags.length > 0);
    
    c.cache.hasActiveFilters = hasFilters;
    return hasFilters;
  };

  // Clear cache when filters change
  c.clearCache = function() {
    c.cache.selectedTags = null;
    c.cache.hasActiveFilters = null;
  };

  // Perform search and emit results
  c.performSearch = function() {
    c.isSearching = true;
    
    // Build search parameters - match the parameter names expected by main widget
    var searchParams = {
      text: c.searchState.text,
      category: c.searchState.category,        // This is now a sys_id
      target_tool: c.searchState.target_tool, // This will be used by main widget as target_tool_filter
      min_rating: c.searchState.min_rating,   // This will be used by main widget as min_rating_filter
      sort_by: c.searchState.sort_by,
      sort_order: c.searchState.sort_order,
      tags: c.searchState.selected_tags       // This will be used by main widget as tags_filter
    };
    
    // Add timing delay to ensure all widgets are loaded (per Service Portal best practices)
    $timeout(function() {
      $rootScope.$broadcast('prompt.search', searchParams);
    }, 100);
    
    // Simulate search delay (remove this in production)
    $timeout(function() {
      c.isSearching = false;
    }, 300);
  };

  // Get category label from value (cached to prevent infinite digest)
  c.getCategoryLabel = function(categoryValue) {
    if (!categoryValue || !$scope.data.categories) return '';
    
    if (c.cache.categoryLabels[categoryValue]) {
      return c.cache.categoryLabels[categoryValue];
    }
    
    var category = $scope.data.categories.find(function(cat) {
      return cat.value === categoryValue;  // Now matching by sys_id
    });
    
    var label = category ? category.label : categoryValue;
    c.cache.categoryLabels[categoryValue] = label;
    return label;
  };

  // Get tool label from value (cached to prevent infinite digest)
  c.getToolLabel = function(toolValue) {
    if (!toolValue || !$scope.data.target_tools) return '';
    
    if (c.cache.toolLabels[toolValue]) {
      return c.cache.toolLabels[toolValue];
    }
    
    var tool = $scope.data.target_tools.find(function(t) {
      return t.value === toolValue;
    });
    
    var label = tool ? tool.label : toolValue;
    c.cache.toolLabels[toolValue] = label;
    return label;
  };

  // Get rating stars array for display (cached to prevent infinite digest)
  c.getRatingStars = function() {
    var rating = Math.floor(c.searchState.min_rating || 0);
    var cacheKey = rating.toString();
    
    if (c.cache.ratingStars[cacheKey]) {
      return c.cache.ratingStars[cacheKey];
    }
    
    var stars = [];
    for (var i = 0; i < rating; i++) {
      stars.push(i);
    }
    
    c.cache.ratingStars[cacheKey] = stars;
    return stars;
  };

  // Listen for external search requests
  var searchRequestListener = $scope.$on('prompt.search.request', function(event, searchText) {
    if (searchText !== undefined) {
      c.searchState.text = searchText;
      c.performSearch();
    }
  });

  // Listen for filter reset requests
  var filterResetListener = $scope.$on('prompt.filters.reset', function() {
    c.clearAllFilters();
  });

  // Cleanup on destroy (proper memory leak prevention)
  $scope.$on('$destroy', function() {
    if (c.searchDebounceTimer) {
      $timeout.cancel(c.searchDebounceTimer);
    }
    searchRequestListener();
    filterResetListener();
  });
}