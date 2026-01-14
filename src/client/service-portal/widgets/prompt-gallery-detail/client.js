function PromptGalleryDetailController($scope, $rootScope, spUtil, $sce, $timeout) {
  var c = this;

  // Initialize controller
  c.$onInit = function() {
    c.userRating = 0;
    c.hoverRating = 0;
    c.isProcessing = false;
    c.isLoading = false;
    c.actionMessage = null;
    c.usageHistory = $scope.data.usage_history || [];
    c.markedReady = false;
    c.contentReady = true; // Show content immediately, enhance with markdown when ready

    // Auto-clear action messages
    c.clearMessageTimer = null;

    // Initialize selected version
    c.initializeSelectedVersion();
    
    // Remove modal close button tooltip with multiple attempts
    c.removeCloseButtonTooltip();
    $timeout(function() { c.removeCloseButtonTooltip(); }, 100);
    $timeout(function() { c.removeCloseButtonTooltip(); }, 500);
    $timeout(function() { c.removeCloseButtonTooltip(); }, 1000);

    // Load marked.js directly in the widget
    c.loadMarkedJS();
  };
  
  // Remove tooltip from modal close button
  c.removeCloseButtonTooltip = function() {
    // Multiple selectors to catch different modal structures
    var selectors = [
      '.modal .modal-header .close',
      '.modal-header .close',
      '.modal .close',
      'button[data-dismiss="modal"]',
      '[aria-label="Close"]'
    ];
    
    selectors.forEach(function(selector) {
      var buttons = document.querySelectorAll(selector);
      buttons.forEach(function(button) {
        if (button.getAttribute('title') === 'Close modal' || button.title === 'Close modal') {
          button.removeAttribute('title');
          button.title = '';
          // Also try to remove any data-toggle tooltip attributes
          button.removeAttribute('data-original-title');
          button.removeAttribute('data-toggle');
        }
        
        // Remove focus from the button to eliminate blue border
        if (document.activeElement === button) {
          button.blur();
        }
        
        // Set tabindex to prevent automatic focus
        button.setAttribute('tabindex', '-1');
      });
    });
  };

  // Load marked.js directly in the widget (bypass UI Script issues)
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

  // Initialize selected version with fallbacks
  c.initializeSelectedVersion = function() {
    // First try the server-provided selected version
    c.selectedVersion = $scope.data.selected_version;
    
    // If no selected version but we have prompt data with versions
    if (!c.selectedVersion && $scope.data.prompt && $scope.data.prompt.versions && $scope.data.prompt.versions.length > 0) {
      // Try to find recommended version first
      var recommendedVersion = $scope.data.prompt.versions.find(function(version) {
        return version.status === 'recommended' || version.is_recommended;
      });
      
      // Use recommended version or first version
      c.selectedVersion = recommendedVersion || $scope.data.prompt.versions[0];
    }

    // Load usage history if we have a selected version
    if (c.selectedVersion) {
      c.loadUsageHistory();
    }
  };

  // Function to get trusted HTML content with Markdown rendering
  c.getTrustedHtml = function(content) {
    if (!content) {
      return $sce.trustAsHtml('<p class="empty-content">No content available</p>');
    }
    
    return c.getRenderedMarkdown(content);
  };

  // Render Markdown to trusted HTML (enhanced but not blocking approach)
  c.getRenderedMarkdown = function(content) {
    if (!content) {
      return $sce.trustAsHtml('<p class="empty-content">No content available</p>');
    }

    // If marked.js is ready, render as markdown
    if (c.markedReady && typeof window.marked !== 'undefined') {
      try {
        console.log('Rendering markdown content');
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

  // Configure marked options
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

  // Basic sanitization - remove dangerous elements and attributes
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

  // Handle version change
  c.onVersionChange = function() {
    if (c.selectedVersion) {
      c.loadUsageHistory();
    }
  };

  // Load usage history for current version
  c.loadUsageHistory = function() {
    if (!c.selectedVersion) return;

    var inputData = {
      action: 'get_usage',
      version_id: c.selectedVersion.sys_id,
      limit: 10
    };

    $scope.server.update(inputData).then(function() {
      c.usageHistory = $scope.data.usage_history || [];
    });
  };

  // Copy functionality
  c.copyToClipboard = function(type, text) {
    if (!text) return;

    // For full_content and full_prompt types, always use raw source
    var textToCopy = text;
    if ((type === 'full_content' || type === 'full_prompt') && text.indexOf('<') !== -1) {
      // If the content has HTML tags (from legacy rich-text), strip them
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = text;
      textToCopy = tempDiv.textContent || tempDiv.innerText || '';
    }
    
    // For markdown content, we want to copy the raw markdown source
    // The server provides the raw content in data.prompt.full_prompt, so we're good

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(function() {
        c.showActionMessage('success', c.getTypeLabel(type) + ' copied to clipboard!');
      }).catch(function(err) {
        console.error('Clipboard write failed:', err);
        c.fallbackCopy(textToCopy, type);
      });
    } else {
      c.fallbackCopy(textToCopy, type);
    }
  };

  // Get user-friendly label for copy type
  c.getTypeLabel = function(type) {
    var labels = {
      'full_content': 'Full prompt',
      'full_prompt': 'Full prompt',
      'full_prompt_content': 'Full prompt',
      'header_prompt': 'Prompt',
      'role': 'Role instructions',
      'prompt': 'Prompt',
      'input': 'Example input',
      'output': 'Example output'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Fallback copy method
  c.fallbackCopy = function(text, type) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      if (successful) {
        c.showActionMessage('success', c.getTypeLabel(type) + ' copied to clipboard!');
      } else {
        c.showActionMessage('error', 'Failed to copy to clipboard. Please copy manually.');
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
      c.showActionMessage('error', 'Copy not supported. Please copy manually.');
    }

    document.body.removeChild(textArea);
  };

  // Copy full prompt (role + prompt body)
  c.copyFullPrompt = function() {
    if (!c.selectedVersion) return;

    var fullPrompt = '';
    
    if (c.selectedVersion.role_instructions && c.selectedVersion.role_instructions.trim()) {
      fullPrompt += c.selectedVersion.role_instructions.trim() + '\n\n';
    }
    
    if (c.selectedVersion.prompt_body && c.selectedVersion.prompt_body.trim()) {
      fullPrompt += c.selectedVersion.prompt_body.trim();
    }

    if (fullPrompt) {
      c.copyToClipboard('full prompt', fullPrompt);
      
      // Track usage for full prompt copy
      c.trackUsage('full_prompt_copy');
    } else {
      c.showActionMessage('error', 'No prompt content available to copy.');
    }
  };

  // Copy full prompt content (for prompts without versions)
  c.copyFullPromptContent = function() {
    if (!$scope.data.prompt || !$scope.data.prompt.full_prompt) {
      c.showActionMessage('error', 'No prompt content available to copy.');
      return;
    }

    var contentToCopy = $scope.data.prompt.full_prompt;
    
    // Strip HTML tags if present
    if (contentToCopy.indexOf('<') !== -1) {
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentToCopy;
      contentToCopy = tempDiv.textContent || tempDiv.innerText || '';
    }

    c.copyToClipboard('full_prompt_content', contentToCopy);
  };

  // Copy full prompt from header button - includes HTML content if available
  c.copyFullPromptFromHeader = function() {
    if (!$scope.data.prompt || !c.selectedVersion) {
      c.showActionMessage('error', 'No prompt available to copy.');
      return;
    }

    var fullPrompt = '';
    
    // First try to use the HTML content from full_prompt field, but strip HTML tags
    if ($scope.data.prompt.full_prompt) {
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = $scope.data.prompt.full_prompt;
      var htmlText = tempDiv.textContent || tempDiv.innerText || '';
      if (htmlText.trim()) {
        fullPrompt = htmlText.trim();
      }
    }
    
    // If no HTML content or it's empty, fall back to version content
    if (!fullPrompt && c.selectedVersion) {
      if (c.selectedVersion.role_instructions && c.selectedVersion.role_instructions.trim()) {
        fullPrompt += c.selectedVersion.role_instructions.trim() + '\n\n';
      }
      
      if (c.selectedVersion.prompt_body && c.selectedVersion.prompt_body.trim()) {
        fullPrompt += c.selectedVersion.prompt_body.trim();
      }
    }

    if (fullPrompt) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(fullPrompt).then(function() {
          c.showActionMessage('success', 'Prompt copied to clipboard!');
          c.trackUsage('header_copy');
        }).catch(function() {
          c.fallbackCopy(fullPrompt, 'header prompt');
        });
      } else {
        c.fallbackCopy(fullPrompt, 'header prompt');
      }
    } else {
      c.showActionMessage('error', 'No prompt content available to copy.');
    }
  };

  // Mark version as used
  c.markAsUsed = function() {
    if (!c.selectedVersion) return;

    c.isProcessing = true;

    var inputData = {
      action: 'mark_used',
      version_id: c.selectedVersion.sys_id,
      context: 'manual_mark_used'
    };

    $scope.server.update(inputData).then(function() {
      var result = $scope.data.action_result;
      
      if (result && result.success) {
        c.showActionMessage('success', 'Marked as used successfully!');
        
        // Update the usage count in the UI
        if (result.usage_count !== undefined) {
          c.selectedVersion.usage_count = result.usage_count;
        }
        
        // Reload usage history
        c.loadUsageHistory();
      } else {
        c.showActionMessage('error', result && result.message || 'Failed to mark as used.');
      }
      
      c.isProcessing = false;
    }).catch(function(error) {
      c.showActionMessage('error', 'An error occurred while marking as used.');
      c.isProcessing = false;
    });
  };

  // Track usage (for analytics)
  c.trackUsage = function(context) {
    if (!c.selectedVersion) return;

    var inputData = {
      action: 'mark_used',
      version_id: c.selectedVersion.sys_id,
      context: context || 'interaction'
    };

    // Don't show loading state for tracking calls
    $scope.server.update(inputData);
  };

  // Submit rating
  c.submitRating = function(rating) {
    if (!c.selectedVersion || !rating || rating < 1 || rating > 5) return;

    c.userRating = rating;

    var inputData = {
      action: 'rate_version',
      version_id: c.selectedVersion.sys_id,
      rating: rating
    };

    $scope.server.update(inputData).then(function() {
      var result = $scope.data.action_result;
      
      if (result && result.success) {
        c.showActionMessage('success', 'Rating submitted successfully!');
        
        // Update the rating display
        if (result.new_average !== undefined) {
          c.selectedVersion.average_rating = result.new_average;
        }
        if (result.rating_count !== undefined) {
          c.selectedVersion.rating_count = result.rating_count;
        }
      } else {
        c.showActionMessage('error', result && result.message || 'Failed to submit rating.');
      }
    }).catch(function(error) {
      c.showActionMessage('error', 'An error occurred while submitting rating.');
    });
  };

  // Generate stars array for display
  c.getStarsArray = function(rating) {
    var stars = [];
    var fullStars = Math.floor(rating || 0);
    var hasHalfStar = (rating % 1) >= 0.5;
    var emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (var i = 0; i < fullStars; i++) {
      stars.push({ class: 'fa-star' });
    }

    // Half star
    if (hasHalfStar) {
      stars.push({ class: 'fa-star-half-o' });
    }

    // Empty stars
    for (var j = 0; j < emptyStars; j++) {
      stars.push({ class: 'fa-star-o' });
    }

    return stars;
  };

  // Show usage history modal
  c.showUsageHistory = function() {
    if (!c.usageHistory || c.usageHistory.length === 0) {
      c.showActionMessage('info', 'No usage history available.');
      return;
    }

    // Create a simple usage history display
    var historyText = 'Recent Usage History:\n\n';
    c.usageHistory.forEach(function(usage, index) {
      historyText += (index + 1) + '. ' + usage.used_by + ' - ' + usage.used_at;
      if (usage.context) {
        historyText += ' (' + usage.context + ')';
      }
      if (usage.engagement) {
        historyText += ' - ' + usage.engagement;
      }
      historyText += '\n';
    });

    // For now, show in an alert - in a full implementation, you'd use a modal
    alert(historyText);
  };

  // Show action message with auto-clear
  c.showActionMessage = function(type, text) {
    c.actionMessage = {
      type: type,
      text: text
    };

    // Clear any existing timer
    if (c.clearMessageTimer) {
      clearTimeout(c.clearMessageTimer);
    }

    // Auto-clear after 5 seconds
    c.clearMessageTimer = setTimeout(function() {
      $scope.$apply(function() {
        c.actionMessage = null;
      });
    }, 5000);
  };

  // Navigate to edit page
  c.editPrompt = function() {
    if (!$scope.data.prompt || !$scope.data.prompt.sys_id) {
      c.showActionMessage('error', 'No prompt available to edit.');
      return;
    }
    
    // Navigate to edit page with proper Service Portal URL structure
    window.location.href = '/prompt-gallery?id=prompt_gallery_edit&sys_id=' + $scope.data.prompt.sys_id;
  };

  // Get header style with category color gradient
  c.getHeaderStyle = function() {
    if (!$scope.data.prompt || !$scope.data.prompt.category_color) {
      return {
        'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      };
    }
    
    var baseColor = $scope.data.prompt.category_color;
    var darkerColor = c.darkenColor(baseColor, 20);
    
    return {
      'background': 'linear-gradient(135deg, ' + baseColor + ' 0%, ' + darkerColor + ' 100%)'
    };
  };

  // Get copy button style with category color
  c.getCopyButtonStyle = function() {
    if (!$scope.data.prompt || !$scope.data.prompt.category_color) {
      return {
        'background': '#0073e6',
        'border-color': '#0073e6'
      };
    }
    
    var baseColor = $scope.data.prompt.category_color;
    var darkerColor = c.darkenColor(baseColor, 15);
    
    return {
      'background': baseColor,
      'border-color': baseColor,
      'transition': 'all 0.3s ease'
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

  // Watch for data changes (in case data loads after controller initialization)
  $scope.$watch('data.prompt', function(newPrompt, oldPrompt) {
    if (newPrompt && newPrompt !== oldPrompt) {
      // Re-initialize selected version when prompt data becomes available
      if (!c.selectedVersion && newPrompt.versions && newPrompt.versions.length > 0) {
        c.initializeSelectedVersion();
      }
    }
  });

  // Watch for marked.js ready state to trigger re-rendering (simplified)
  $scope.$watch(function() { return c.contentReady; }, function(newVal, oldVal) {
    if (newVal && !oldVal) {
      console.log('Content is ready for display');
    }
  });

  // Clean up on destroy
  $scope.$on('$destroy', function() {
    if (c.clearMessageTimer) {
      clearTimeout(c.clearMessageTimer);
    }
  });
}