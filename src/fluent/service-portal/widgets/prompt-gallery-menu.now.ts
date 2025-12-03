import '@servicenow/sdk/global';
import { Record } from '@servicenow/sdk/core';

// Header Menu Widget - Renders the navigation menu items
export const prompt_gallery_menu_widget = Record({
  $id: Now.ID['prompt_gallery_menu_widget'],
  table: 'sp_widget',
  data: {
    id: 'prompt_gallery_menu',
    name: 'Prompt Gallery Menu',
    description: 'Menu widget that renders navigation items for the Prompt Gallery header',
    template: `<ul class="nav navbar-nav">
  <li ng-repeat="item in data.menu.items" 
      ng-class="{'active': item.active, 'dropdown': item.items && item.items.length > 0}">
    
    <!-- Regular menu item (no children) -->
    <a ng-if="!item.items || item.items.length === 0" 
       href="{{item.href}}" 
       target="{{item.target}}"
       role="menuitem">
      <i class="fa {{item.glyph}}" ng-if="item.glyph" aria-hidden="true"></i>
      {{item.label}}
    </a>
    
    <!-- Dropdown menu item (has children) -->
    <a ng-if="item.items && item.items.length > 0"
       href="#" 
       class="dropdown-toggle" 
       data-toggle="dropdown" 
       role="button" 
       aria-haspopup="true" 
       aria-expanded="false">
      <i class="fa {{item.glyph}}" ng-if="item.glyph" aria-hidden="true"></i>
      {{item.label}}
      <span class="caret"></span>
    </a>
    
    <!-- Dropdown menu items -->
    <ul class="dropdown-menu" ng-if="item.items && item.items.length > 0" role="menu">
      <li ng-repeat="subitem in item.items" role="presentation">
        <a href="{{subitem.href}}" 
           target="{{subitem.target}}" 
           role="menuitem">
          <i class="fa {{subitem.glyph}}" ng-if="subitem.glyph" aria-hidden="true"></i>
          {{subitem.label}}
        </a>
      </li>
    </ul>
    
  </li>
</ul>`,
    script: `(function() {
      // Get menu instance sys_id from widget parameters or portal
      var menu_id = options.sys_id || $sp.getValue('sys_id');
      
      // Build menu structure from sp_rectangle_menu_item records
      data.menu = {};
      data.menu.items = $sp.getMenuItems(menu_id);
      
      // Process menu items for proper display
      if (data.menu.items) {
        data.menu.items.forEach(function(item) {
          // Ensure proper href values
          if (item.type === 'page' && item.sp_page) {
            item.href = '?id=' + item.sp_page;
          } else if (item.type === 'url') {
            item.href = item.url || '#';
          } else if (item.type === 'kb') {
            item.href = '?id=kb_home';
          } else if (item.type === 'sc') {
            item.href = '?id=sc_category';
          }
          
          // Set default target
          item.target = item.target || '_self';
          
          // Process child items if they exist
          if (item.items && item.items.length > 0) {
            item.items.forEach(function(subitem) {
              if (subitem.type === 'page' && subitem.sp_page) {
                subitem.href = '?id=' + subitem.sp_page;
              } else if (subitem.type === 'url') {
                subitem.href = subitem.url || '#';
              }
              subitem.target = subitem.target || '_self';
            });
          }
        });
      }
    })()`,
    css: `/* Menu Widget Styles */
.nav.navbar-nav {
  margin: 0;
}

.nav.navbar-nav > li > a {
  padding: 15px;
  color: #9d9d9d;
  transition: color 0.3s ease;
}

.nav.navbar-nav > li > a:hover,
.nav.navbar-nav > li > a:focus {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav.navbar-nav > li.active > a,
.nav.navbar-nav > li.active > a:hover,
.nav.navbar-nav > li.active > a:focus {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.2);
}

.nav.navbar-nav .dropdown-menu {
  background-color: #333;
  border: none;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
}

.nav.navbar-nav .dropdown-menu > li > a {
  color: #9d9d9d;
  padding: 10px 20px;
}

.nav.navbar-nav .dropdown-menu > li > a:hover,
.nav.navbar-nav .dropdown-menu > li > a:focus {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav.navbar-nav .fa {
  margin-right: 5px;
}`,
    client_script: `api.controller = function() {
      // Menu controller - handles navigation events if needed
      var c = this;
      
      // Add any client-side menu functionality here
    };`,
    option_schema: '[]',
    demo_data: '{}',
    docs: 'Navigation menu widget that renders menu items from sp_rectangle_menu_item records',
    public: false,
    has_preview: true,
    servicenow: false,
    data_table: 'sp_instance',

    controller_as: 'c'
  }
});