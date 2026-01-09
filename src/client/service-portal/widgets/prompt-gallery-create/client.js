function PromptGalleryCreateController($scope, $location, $window) {
  var c = this;
  
  // Initialize form data
  c.formData = {
    name: '',
    short_description: '',
    full_prompt: '',
    category: '',
    owner_team: '',
    is_active: true
  };
  
  c.isSubmitting = false;
  
  // Function to create prompt
  c.createPrompt = function() {
    if (c.isSubmitting) {
      return;
    }
    
    // Client-side validation before server call
    if (!c.isFormValid()) {
      c.data.error_message = 'Please fill in all required fields.';
      return;
    }
    
    c.isSubmitting = true;
    
    // Clear previous messages
    c.data.success_message = '';
    c.data.error_message = '';
    
    // Use server.get() with data object - the documented pattern for targeted server calls
    c.server.get({
      action: 'create_prompt',
      name: c.formData.name,
      short_description: c.formData.short_description,
      full_prompt: c.formData.full_prompt,
      category: c.formData.category,
      owner_team: c.formData.owner_team,
      is_active: c.formData.is_active
    }).then(function() {
      c.isSubmitting = false;
      
      // Since creation works but no success_message is set, redirect if no error occurred
      var hasError = c.data.error_message && c.data.error_message.trim() !== '';
      
      if (!hasError) {
        // Reset form on success
        c.formData = {
          name: '',
          short_description: '',
          full_prompt: '',
          category: '',
          owner_team: '',
          is_active: true
        };
        
        // Reset form validation state
        if ($scope.createPromptForm) {
          $scope.createPromptForm.$setPristine();
          $scope.createPromptForm.$setUntouched();
        }
        
        // Clear draft on successful submission
        c.clearDraft();
        
        // Redirect to Prompt Gallery homepage
        $location.search('id', 'prompt_gallery');
      }
    }, function(error) {
      c.isSubmitting = false;
      console.error('Error creating prompt:', error);
      c.data.error_message = 'An unexpected error occurred. Please try again.';
    });
  };
  
  // Function to reset form
  c.resetForm = function() {
    c.formData = {
      name: '',
      short_description: '',
      full_prompt: '',
      category: '',
      owner_team: '',
      is_active: true
    };
    
    c.data.success_message = '';
    c.data.error_message = '';
    
    if ($scope.createPromptForm) {
      $scope.createPromptForm.$setPristine();
      $scope.createPromptForm.$setUntouched();
    }
  };
  
  // Function to cancel and go back to gallery
  c.cancel = function() {
    $location.url('?id=prompt_gallery');
  };
  
  // Character count helpers
  c.getDescriptionLength = function() {
    return c.formData.short_description ? c.formData.short_description.length : 0;
  };
  
  c.getContentLength = function() {
    return c.formData.full_prompt ? c.formData.full_prompt.length : 0;
  };
  
  // Validation helpers
  c.isFormValid = function() {
    return c.formData.name && 
           c.formData.name.trim() !== '' && 
           c.formData.full_prompt && 
           c.formData.full_prompt.trim() !== '' &&
           c.formData.category &&
           c.formData.category.trim() !== '';
  };
  
  // Auto-save draft functionality (optional)
  var draftKey = 'prompt_gallery_create_draft';
  
  // Load draft on init
  c.loadDraft = function() {
    try {
      var draft = localStorage.getItem(draftKey);
      if (draft) {
        var draftData = JSON.parse(draft);
        c.formData = Object.assign(c.formData, draftData);
      }
    } catch (e) {
      console.warn('Could not load draft:', e);
    }
  };
  
  // Save draft periodically
  c.saveDraft = function() {
    try {
      localStorage.setItem(draftKey, JSON.stringify(c.formData));
    } catch (e) {
      console.warn('Could not save draft:', e);
    }
  };
  
  // Clear draft on successful submission
  c.clearDraft = function() {
    try {
      localStorage.removeItem(draftKey);
    } catch (e) {
      console.warn('Could not clear draft:', e);
    }
  };
  
  // Watch for form changes to auto-save draft
  $scope.$watch('c.formData', function(newVal, oldVal) {
    if (newVal !== oldVal && (newVal.name || newVal.full_prompt)) {
      c.saveDraft();
    }
  }, true);
  
  // Load draft on init
  c.loadDraft();
  
  // Clear draft when form is successfully submitted
  $scope.$watch('c.data.success_message', function(newVal) {
    if (newVal) {
      c.clearDraft();
    }
  });
}