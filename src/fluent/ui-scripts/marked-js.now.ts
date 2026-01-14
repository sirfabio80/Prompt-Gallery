import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

export const marked_js_ui_script = Record({
  $id: Now.ID['marked_js_ui_script'],
  table: 'sys_ui_script',
  data: {
    name: 'MarkedJS',
    description: 'Markdown parser and compiler library for rendering Markdown content',
    script: `// Marked.js - Markdown Parser and Compiler for Service Portal
// Simple and reliable marked.js loading
(function() {
  'use strict';
  
  console.log('MarkedJS UI Script loading...');
  
  // Check if marked is already loaded
  if (typeof window.marked !== 'undefined') {
    console.log('marked.js already loaded');
    return;
  }
  
  // Simple script injection approach
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
  script.async = false; // Load synchronously for reliability
  script.defer = false;
  
  script.onload = function() {
    console.log('marked.js loaded successfully from CDN');
    console.log('window.marked available:', typeof window.marked !== 'undefined');
    
    // Configure marked options after loading
    if (typeof window.marked !== 'undefined') {
      try {
        window.marked.setOptions({
          breaks: true,           // Convert \\n to <br>
          gfm: true,             // GitHub Flavored Markdown
          headerIds: false,      // Disable auto header IDs (security)
          mangle: false,         // Don't mangle email addresses
          sanitize: false        // We'll use Angular's $sce for sanitization
        });
        console.log('marked.js configured successfully');
        window.marked._configured = true;
      } catch (e) {
        console.error('Error configuring marked.js:', e);
      }
    }
  };
  
  script.onerror = function(error) {
    console.error('Failed to load marked.js:', error);
  };
  
  // Insert at the very beginning of head for immediate loading
  var head = document.head || document.getElementsByTagName('head')[0];
  head.insertBefore(script, head.firstChild);
  
})();`,
    global: true,
    active: true,
    ui_type: 'desktop'
  }
});