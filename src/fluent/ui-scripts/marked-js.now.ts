import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

export const marked_js_ui_script = Record({
  $id: Now.ID['marked_js_ui_script'],
  table: 'sys_ui_script',
  data: {
    name: 'MarkedJS',
    description: 'Markdown parser and compiler library for rendering Markdown content',
    script: `// Marked.js - Markdown Parser and Compiler for Service Portal
// Load marked.js library for client-side Markdown rendering
(function() {
  'use strict';
  
  console.log('MarkedJS UI Script loading...');
  
  // Check if marked is already loaded
  if (typeof window.marked !== 'undefined') {
    console.log('marked.js already loaded');
    return;
  }
  
  // Load marked.js from CDN
  function loadMarkedJS() {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/marked@9.1.6/marked.min.js';
      script.async = true;
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
        
        resolve();
      };
      
      script.onerror = function(error) {
        console.error('Failed to load marked.js:', error);
        reject(new Error('Failed to load marked.js'));
      };
      
      // Insert before first script tag to ensure early loading
      var firstScript = document.getElementsByTagName('script')[0];
      if (firstScript) {
        firstScript.parentNode.insertBefore(script, firstScript);
      } else {
        document.head.appendChild(script);
      }
    });
  }
  
  // Load the library immediately
  loadMarkedJS().then(function() {
    console.log('MarkedJS UI Script loaded successfully');
  }).catch(function(error) {
    console.error('Error in MarkedJS UI Script:', error);
  });
  
  // Make loading function available globally for widgets that need it
  window.markedJSLoader = loadMarkedJS;
  
})();`,
    global: true,
    active: true,
    ui_type: 'desktop'
  }
});