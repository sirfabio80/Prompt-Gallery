function PromptGalleryEditController($scope, $sce, $timeout, spUtil, $window) {
  var c = this;

  // Controller properties
  c.isLoading = false;
  c.isSubmitting = false;
  c.formData = {};
  c.originalData = {};

  // Initialize controller
  c.$onInit = function() {
    c.initializeForm();
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
    if ($scope.promptForm.$invalid) {
      spUtil.addErrorMessage('Please fix the form errors before saving.');
      return;
    }

    c.isSubmitting = true;

    var updateData = {
      action: 'update_prompt',
      name: c.formData.name.trim(),
      short_description: c.formData.short_description ? c.formData.short_description.trim() : '',
      full_prompt: c.formData.full_prompt,
      category: c.formData.category,
      owner_team: c.formData.owner_team,
      is_active: c.formData.is_active
    };

    $scope.server.update(updateData).then(function() {
      c.isSubmitting = false;
      
      if ($scope.data.error_message) {
        spUtil.addErrorMessage($scope.data.error_message);
      } else if ($scope.data.success_message) {
        spUtil.addInfoMessage($scope.data.success_message);
        
        // Update original data to reflect saved state
        c.originalData = angular.copy(c.formData);
        
        // Optionally redirect back to gallery after a delay
        $timeout(function() {
          if (c.shouldRedirectAfterSave()) {
            c.goBackToGallery();
          }
        }, 2000);
      }
    }).catch(function(error) {
      c.isSubmitting = false;
      spUtil.addErrorMessage('An error occurred while saving the prompt.');
      console.error('Error saving prompt:', error);
    });
  };

  // Cancel edit and go back
  c.cancelEdit = function() {
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

  // Determine if should redirect after save
  c.shouldRedirectAfterSave = function() {
    // Could add user preference here
    return true;
  };

  // Navigate back to gallery
  c.goBackToGallery = function() {
    $window.location.href = '/prompt-gallery';
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
      spUtil.addErrorMessage('No content to preview.');
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

  // Get preview HTML (safely)
  c.getPreviewHtml = function() {
    if (!c.formData.full_prompt) return '';
    
    // Basic HTML sanitization/rendering
    var content = c.formData.full_prompt;
    
    // If content contains HTML tags, trust it (assuming it's safe)
    if (content.indexOf('<') !== -1) {
      return $sce.trustAsHtml(content);
    } else {
      // Convert line breaks to <br> for plain text
      return $sce.trustAsHtml(content.replace(/\n/g, '<br>'));
    }
  };

  // Form validation helpers
  c.isFieldInvalid = function(fieldName) {
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
      if (c.hasUnsavedChanges() && !c.isSubmitting && $scope.promptForm.$valid) {
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
}