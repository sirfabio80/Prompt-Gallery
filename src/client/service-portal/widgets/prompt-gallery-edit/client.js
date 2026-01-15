function PromptGalleryEditController($scope, $sce, $timeout, spUtil, $window, $location) {
  var c = this;

  // Controller properties
  c.isLoading = false;
  c.isSubmitting = false;
  c.formData = {};
  c.originalData = {};
  c.saveInProgress = false; // Track if a save operation initiated the message

  // Initialize controller
  c.$onInit = function() {
    c.initializeForm();
    c.markedReady = false;
    c.loadMarkedJS();
    
    // Initialize message timers
    c.errorMessageTimer = null;
    c.successMessageTimer = null;
    
    // Clear any stale success messages on page load
    // Success messages should only appear after user saves
    $scope.data.success_message = null;
    
    // Set up auto-clear for existing error messages only
    c.setupMessageAutoClearing();
  };

  // Initialize form data
  c.initializeForm = function() {
    
    if ($scope.data.prompt) {
      // Store original data for comparison
      c.originalData = angular.copy($scope.data.prompt);
      
      // Initialize form data with prompt values
      c.formData = {
        name: $scope.data.prompt.name || '',
        short_description: $scope.data.prompt.short_description || '',
        full_prompt: $scope.data.prompt.full_prompt || '',
        category: $scope.data.prompt.category || '',
        owner_team: $scope.data.prompt.owner_team || '',
        is_active: $scope.data.prompt.is_active
      };

      // Debug log to help troubleshoot
      console.log('Initializing form - is_active value:', $scope.data.prompt.is_active, 'type:', typeof $scope.data.prompt.is_active, 'converted:', c.formData.is_active);
    } else {
      // Initialize empty form
      c.formData = {
        name: '',
        short_description: '',
        full_prompt: '',
        category: '',
        owner_team: '',
        is_active: true
      };
    }
  };

  // Update prompt
  c.updatePrompt = function() {
    console.log("c.updatePrompt executed");
    
    // Clear any existing messages first
    $scope.data.error = null;
    $scope.data.success_message = null;
    
    // Check if form exists and is invalid
    if ($scope.promptForm && $scope.promptForm.$invalid) {
      // Set validation error message that will auto-clear
      $scope.data.error = 'Please fix the form errors before saving.';
      return;
    }

    c.isSubmitting = true;
    c.saveInProgress = true; // Mark that we're in a save operation

    var updateData = {
      action: 'update_prompt',
      name: c.formData.name.trim(),
      short_description: c.formData.short_description ? c.formData.short_description.trim() : '',
      full_prompt: c.formData.full_prompt,
      category: c.formData.category,
      owner_team: c.formData.owner_team,
      is_active: c.formData.is_active
    };

    $scope.server.get(updateData).then(function() {
      c.isSubmitting = false;
      c.saveInProgress = false; // Clear the save operation flag
      console.log("Update server response received");
      
      // Check if server returned an error
      if ($scope.data.error_message) {
        // Server returned an error
        $scope.data.error = $scope.data.error_message;
        $scope.data.error_message = null; // Clear the server field
      } else {
        // Save was successful - show success message
        // Use server message if provided, otherwise use default
        var successMsg = $scope.data.success_message || 'Prompt has been saved successfully!';
        $scope.data.success_message = successMsg;
        
        console.log("Success message set:", successMsg);
        // Update original data to reflect saved state
        c.originalData = angular.copy(c.formData);
      }
      
      console.log("Update completed successfully");
    }).catch(function(error) {
      c.isSubmitting = false;
      c.saveInProgress = false; // Clear the save operation flag
      // Error handling - show a user-friendly error message
      console.error('Update failed:', error);
      $scope.data.error = 'An unexpected error occurred while saving. Please try again.';
    });
  };

  // Cancel edit and go back
  c.cancelEdit = function() {
    console.log("c.hasUnsavedChanges() ",c.hasUnsavedChanges());
    if (c.hasUnsavedChanges()) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        c.goBackToGallery();
      }
    } else {
      c.goBackToGallery();
    }
  };

  // Check for unsaved changes
  c.hasUnsavedChanges = function() {
    if (!c.originalData || !c.formData) return false;
    
    return c.formData.name !== c.originalData.name ||
           c.formData.short_description !== c.originalData.short_description ||
           c.formData.full_prompt !== c.originalData.full_prompt ||
           c.formData.category !== c.originalData.category ||
           c.formData.owner_team !== c.originalData.owner_team ||
           c.formData.is_active !== c.originalData.is_active;
  };


  // Navigate back to gallery
  c.goBackToGallery = function() {
    console.log("Inside c.goBackToGallery()");
    var homepageId = $scope.data.homepage || 'prompt_gallery';
    console.log("Inside c.goBackToGallery() homepageId: ",homepageId);
    $location.search({
      id: homepageId
    });
  };

  // Get header style with category color gradient
  c.getHeaderStyle = function() {
    if (!c.formData || !c.formData.category || !$scope.data.categories) {
      return {
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      };
    }
    
    // Find the category and get its color
    var category = $scope.data.categories.find(function(cat) {
      return cat.sys_id === c.formData.category;
    });
    
    if (!category || !category.color) {
      return {
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      };
    }
    
    var baseColor = category.color;
    var darkerColor = c.darkenColor(baseColor, 20);
    
    return {
      'background': 'linear-gradient(135deg, ' + baseColor + ' 0%, ' + darkerColor + ' 100%)'
    };
  };

  // Helper function to darken a hex color
  c.darkenColor = function(hexColor, percent) {
    // Remove # if present
    hexColor = hexColor.replace('#', '');
    
    // Convert to RGB
    var r = parseInt(hexColor.substr(0, 2), 16);
    var g = parseInt(hexColor.substr(2, 2), 16);
    var b = parseInt(hexColor.substr(4, 2), 16);
    
    // Darken by percentage
    r = Math.max(0, Math.floor(r * (100 - percent) / 100));
    g = Math.max(0, Math.floor(g * (100 - percent) / 100));
    b = Math.max(0, Math.floor(b * (100 - percent) / 100));
    
    // Convert back to hex
    var rHex = r.toString(16).padStart(2, '0');
    var gHex = g.toString(16).padStart(2, '0');
    var bHex = b.toString(16).padStart(2, '0');
    
    return '#' + rHex + gHex + bHex;
  };

  // Get button style with category color gradient
  c.getButtonStyle = function() {
    if (!c.formData || !c.formData.category || !$scope.data.categories) {
      return {
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      };
    }
    
    // Find the category and get its color
    var category = $scope.data.categories.find(function(cat) {
      return cat.sys_id === c.formData.category;
    });
    
    if (!category || !category.color) {
      return {
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      };
    }
    
    var baseColor = category.color;
    var darkerColor = c.darkenColor(baseColor, 20);
    
    return {
      'background': 'linear-gradient(135deg, ' + baseColor + ' 0%, ' + darkerColor + ' 100%)'
    };
  };

  // Preview functionality
  c.previewPrompt = function() {
    if (!c.formData.full_prompt) {
      // Set error message that will auto-clear instead of using spUtil
      $scope.data.error = 'No content to preview.';
      return;
    }
    
    // Show modal (assuming Bootstrap is available)
    if (typeof $ !== 'undefined' && $.fn.modal) {
      $('#previewModal').modal('show');
    } else {
      // Fallback - could implement custom modal or use different approach
      alert('Preview: ' + c.formData.name + '\n\n' + c.formData.short_description + '\n\n' + c.formData.full_prompt);
    }
  };

  // Load marked.js directly in the widget (same as prompt-gallery-detail)
  c.loadMarkedJS = function() {
    // First check if marked.js is already available from any source
    if (typeof window.marked !== 'undefined') {
      console.log('marked.js already available');
      c.initMarked();
      c.markedReady = true;
      return;
    }

    // Load marked.js directly
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
    script.async = true; // Load asynchronously to not block UI
    
    script.onload = function() {
      console.log('marked.js loaded successfully');
      if (typeof window.marked !== 'undefined') {
        c.initMarked();
        $timeout(function() {
          c.markedReady = true;
        });
      } else {
        console.warn('marked.js script loaded but window.marked not available');
      }
    };
    
    script.onerror = function(error) {
      console.error('Failed to load marked.js:', error);
      // Content is already showing, just won't have markdown enhancement
    };
    
    // Add to head
    document.head.appendChild(script);
  };

  // Configure marked options (same as prompt-gallery-detail)
  c.initMarked = function() {
    if (typeof window.marked !== 'undefined') {
      // Configure marked if not already configured
      if (!window.marked._configured) {
        try {
          window.marked.setOptions({
            breaks: true,           // Convert \n to <br>
            gfm: true,             // GitHub Flavored Markdown
            headerIds: false,      // Disable auto header IDs (security)
            mangle: false,         // Don't mangle email addresses
            sanitize: false        // We'll use custom sanitization
          });
          window.marked._configured = true;
          console.log('marked.js configured successfully');
        } catch (e) {
          console.error('Error configuring marked.js:', e);
        }
      }
      return true;
    }
    return false;
  };

  // HTML escape for fallback
  c.escapeHtml = function(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Basic sanitization - remove dangerous elements and attributes (same as prompt-gallery-detail)
  c.sanitizeHtml = function(html) {
    // Remove script tags
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove event handlers
    html = html.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove javascript: URLs
    html = html.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
    html = html.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src="#"');
    
    // Remove style attributes that might contain expression()
    html = html.replace(/style\s*=\s*["'][^"']*expression\s*\([^"']*["']/gi, '');
    
    // Remove potentially dangerous attributes
    html = html.replace(/\s*(?:onload|onerror|onmouseover|onmouseout|onclick|ondblclick|onkeydown|onkeyup|onkeypress|onsubmit|onreset|onselect|onblur|onfocus|onabort)\s*=\s*["'][^"']*["']/gi, '');
    
    return html;
  };

  // Render Markdown to trusted HTML (enhanced preview with markdown support)
  c.getRenderedMarkdown = function(content) {
    if (!content) {
      return $sce.trustAsHtml('<p class="empty-content">No content available</p>');
    }

    // If marked.js is ready, render as markdown
    if (c.markedReady && typeof window.marked !== 'undefined') {
      try {
        console.log('Rendering markdown content in preview');
        var rendered = window.marked.parse(content);
        
        // Basic XSS protection - remove script tags and event handlers
        rendered = c.sanitizeHtml(rendered);
        
        return $sce.trustAsHtml(rendered);
      } catch (e) {
        console.error('Markdown parsing error:', e);
        // Fall through to plain text rendering
      }
    }

    // Fallback: Show content as preformatted text (better than nothing)
    return $sce.trustAsHtml('<pre class="content-text">' + c.escapeHtml(content) + '</pre>');
  };

  // Get preview HTML (enhanced with markdown support)
  c.getPreviewHtml = function() {
    if (!c.formData.full_prompt) return '';
    
    var content = c.formData.full_prompt;
    
    // Use the enhanced markdown rendering function
    return c.getRenderedMarkdown(content);
  };

  // Setup auto-clearing for messages (only for errors on page load)
  c.setupMessageAutoClearing = function() {
    // Handle error_message field by moving it to error field
    if ($scope.data.error_message) {
      $scope.data.error = $scope.data.error_message;
      $scope.data.error_message = null;
    }
    
    // Clear error message after 5 seconds if it exists
    // (only errors should auto-clear on page load, not success messages)
    if ($scope.data.error) {
      c.clearErrorMessageAfterDelay();
    }
    
    // Note: Success messages are not auto-cleared on page load
    // They should only appear after user actions (save)
  };

  // Clear error message with timer
  c.clearErrorMessageAfterDelay = function() {
    // Clear any existing timer
    if (c.errorMessageTimer) {
      $timeout.cancel(c.errorMessageTimer);
    }

    // Set timer to clear error message after 5 seconds
    c.errorMessageTimer = $timeout(function() {
      $scope.data.error = null;
      c.errorMessageTimer = null;
    }, 5000);
  };

  // Clear success message with timer
  c.clearSuccessMessageAfterDelay = function() {
    // Clear any existing timer
    if (c.successMessageTimer) {
      $timeout.cancel(c.successMessageTimer);
    }

    // Set timer to clear success message after 5 seconds
    c.successMessageTimer = $timeout(function() {
      $scope.data.success_message = null;
      c.successMessageTimer = null;
    }, 5000);
  };

  // Manually clear error message
  c.clearErrorMessage = function() {
    if (c.errorMessageTimer) {
      $timeout.cancel(c.errorMessageTimer);
      c.errorMessageTimer = null;
    }
    $scope.data.error = null;
  };

  // Manually clear success message
  c.clearSuccessMessage = function() {
    if (c.successMessageTimer) {
      $timeout.cancel(c.successMessageTimer);
      c.successMessageTimer = null;
    }
    $scope.data.success_message = null;
  };

  // Form validation helpers
  c.isFieldInvalid = function(fieldName) {
    if (!$scope.promptForm) return false;
    var field = $scope.promptForm[fieldName];
    return field && field.$invalid && field.$touched;
  };

  // Get category label by ID
  c.getCategoryLabel = function(categoryId) {
    if (!categoryId || !$scope.data.categories) return '';
    
    var category = $scope.data.categories.find(function(cat) {
      return cat.sys_id === categoryId;
    });
    
    return category ? (category.display_name || category.label || category.name) : '';
  };

  // Get team label by ID
  c.getTeamLabel = function(teamId) {
    if (!teamId || !$scope.data.teams) return '';
    
    var team = $scope.data.teams.find(function(tm) {
      return tm.sys_id === teamId;
    });
    
    return team ? team.label : '';
  };

  // Character count helpers
  c.getCharacterCount = function(text) {
    return text ? text.length : 0;
  };

  c.getCharacterCountClass = function(text, maxLength) {
    var count = c.getCharacterCount(text);
    var percentage = (count / maxLength) * 100;
    
    if (percentage >= 90) return 'text-danger';
    if (percentage >= 75) return 'text-warning';
    return 'text-muted';
  };

  // Auto-save functionality (optional)
  c.enableAutoSave = function() {
    var autoSaveInterval = 30000; // 30 seconds
    
    c.autoSaveTimer = $timeout(function autoSave() {
      if (c.hasUnsavedChanges() && !c.isSubmitting && $scope.promptForm && $scope.promptForm.$valid) {
        console.log('Auto-saving draft...');
        // Could implement draft saving here
      }
      
      // Schedule next auto-save
      c.autoSaveTimer = $timeout(autoSave, autoSaveInterval);
    }, autoSaveInterval);
  };

  // Clean up on destroy
  $scope.$on('$destroy', function() {
    if (c.autoSaveTimer) {
      $timeout.cancel(c.autoSaveTimer);
    }
    if (c.errorMessageTimer) {
      $timeout.cancel(c.errorMessageTimer);
    }
    if (c.successMessageTimer) {
      $timeout.cancel(c.successMessageTimer);
    }
  });

  // Warn about unsaved changes on page unload
  $window.addEventListener('beforeunload', function(e) {
    if (c.hasUnsavedChanges()) {
      var confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  });

  // Watch for data changes to reinitialize form
  $scope.$watch('data.prompt', function(newPrompt, oldPrompt) {
    if (newPrompt && newPrompt !== oldPrompt) {
      c.initializeForm();
    }
  });

  // Watch for category changes to update styling
  $scope.$watch('c.formData.category', function(newCategory, oldCategory) {
    if (newCategory !== oldCategory) {
      // Force update of dynamic styles by triggering digest cycle
      $scope.$evalAsync();
    }
  });

  // Watch for marked.js ready state to trigger re-rendering of preview
  $scope.$watch(function() { return c.markedReady; }, function(newVal, oldVal) {
    if (newVal && !oldVal) {
      console.log('Markdown renderer is ready for preview');
      // Trigger digest to update preview if modal is open
      $scope.$evalAsync();
    }
  });

  // Watch for new error messages to set up auto-clear
  $scope.$watch('data.error', function(newError, oldError) {
    if (newError && newError !== oldError) {
      c.clearErrorMessageAfterDelay();
    }
  });

  // Watch for new success messages to set up auto-clear
  $scope.$watch('data.success_message', function(newSuccess, oldSuccess) {
    if (newSuccess && newSuccess !== oldSuccess) {
      c.clearSuccessMessageAfterDelay();
    }
  });

  // Watch for error_message field and consolidate into error field
  $scope.$watch('data.error_message', function(newErrorMessage, oldErrorMessage) {
    if (newErrorMessage && newErrorMessage !== oldErrorMessage) {
      // Move error_message to error field so it gets auto-clear behavior
      $scope.data.error = newErrorMessage;
      $scope.data.error_message = null; // Clear the original field
    }
  });
}