import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// Prompt Gallery Header - Minimalist design inspired by Portal Polaris Header
export const prompt_gallery_header_footer = Record({
    $id: Now.ID['prompt_gallery_header_footer'],
    table: 'sp_header_footer',
    forcedId: '511a7cb8fdbd49e3b452acd5fc2354fb', // Using the existing sys_id
    data: {
        id: 'prompt_gallery_header',
        name: 'Prompt Gallery Header',
        template: `<!-- Modern Prompt Gallery Header -->
<header class="prompt-gallery-header" role="banner" aria-label="Site Header">
  <div class="header-container">
    <!-- Logo/Brand Section -->
    <div class="header-brand">
      <a class="brand-link" 
         href="?id={{::portal.homepage_dv}}" 
         aria-label="{{::portal.title}} - Home">
        <img ng-if="portal.logo" 
             ng-src="{{::portal.logo}}" 
             alt="{{::portal.title}}" 
             class="brand-logo"/>
        <span ng-if="!portal.logo" class="brand-text">{{::portal.title}}</span>
      </a>
    </div>

    <!-- Navigation Menu -->
    <nav class="header-nav" role="navigation" aria-label="Main Navigation">
      <ul class="nav-menu">
        <!-- Create New Prompt Button (with fade animation) -->
        <li ng-if="::user.logged_in && (page.id == 'prompt_gallery' || page.id == 'prompt_create' || page.id == 'prompt_gallery_edit')" 
            class="create-prompt-item" 
            ng-class="{'hidden': page.id == 'prompt_create'}">
          <a href="?id=prompt_create" class="nav-link create-prompt-link" aria-label="Create New Prompt">
            <i class="fa fa-plus" aria-hidden="true"></i>
            <span>Create New Prompt</span>
          </a>
        </li>
        
        <!-- Login link for anonymous users -->
        <li ng-if="::(!user.logged_in && page.id != portal.login_page_dv)">
          <a href="#" ng-click="openLogin()" class="nav-link login-link" aria-label="Login">
            <i class="fa fa-sign-in" aria-hidden="true"></i>
            <span>Login</span>
          </a>
        </li>
        
        <!-- User menu for logged in users -->
        <li ng-if="::user.logged_in" class="user-menu-item dropdown" ng-class="{'open': dropdownOpen}">
          <a href="#" 
             class="nav-link user-link dropdown-toggle" 
             ng-click="toggleDropdown($event)"
             aria-label="{{c.userLabel}}"
             aria-expanded="{{dropdownOpen}}">
            <sn-avatar class="user-avatar" primary="avatarProfile" />
            <i class="fa fa-chevron-down" aria-hidden="true"></i>
          </a>
          <ul class="dropdown-menu user-dropdown" role="menu" ng-class="{'show': dropdownOpen}">
            <li role="menuitem">
              <a ng-href="?id={{::data.supportProfilePortal}}" class="dropdown-link">
                <i class="fa fa-user" aria-hidden="true"></i>
                Profile
              </a>
            </li>
            <li role="menuitem">
              <a href="{{::portal.logoutUrl}}" class="dropdown-link logout-link">
                <i class="fa fa-sign-out" aria-hidden="true"></i>
                Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</header>`,
        
        css: `/* Modern Prompt Gallery Header Styles */
.prompt-gallery-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1030;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 70px;
}

/* Logo/Brand Section */
.header-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
  font-weight: 600;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.brand-link:hover,
.brand-link:focus {
  color: #f8f9fa;
  text-decoration: none;
  transform: scale(1.02);
}

.brand-logo {
  height: 40px;
  width: auto;
  max-width: 200px;
  object-fit: contain;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

/* Navigation Menu */
.header-nav {
  flex-shrink: 0;
}

.nav-menu {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  gap: 0.5rem;
}

.nav-menu li {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover,
.nav-link:focus {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.15);
  text-decoration: none;
  transform: translateY(-1px);
}

/* Create New Prompt Button */
.create-prompt-item {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out, transform 0.3s ease;
  transform: translateX(0);
}

.create-prompt-item.hidden {
  opacity: 0;
  visibility: hidden;
  transform: translateX(20px);
}

.create-prompt-link {
  background-color: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.5rem;
  font-weight: 600;
  padding: 0.75rem 1.25rem;
}

.create-prompt-link:hover,
.create-prompt-link:focus {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.login-link {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

/* User Menu - Simplified */
.user-link {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
}

.fa-chevron-down {
  font-size: 0.7rem;
  opacity: 0.7;
  transition: transform 0.2s ease;
}

.dropdown.open .fa-chevron-down {
  transform: rotate(180deg);
}

/* Dropdown Menu - Simplified Animation */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  left: unset;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  z-index: 1050;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-5px) scale(0.95);
  transition: all 0.2s ease;
}

.dropdown.open .user-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.dropdown-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-link:hover,
.dropdown-link:focus {
  background-color: #f3f4f6;
  color: #1f2937;
  text-decoration: none;
}

.dropdown-link i {
  width: 16px;
  text-align: center;
  opacity: 0.7;
}

.logout-link:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

.logout-link:hover i {
  opacity: 1;
  color: #dc2626;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
    height: 60px;
  }
  
  .brand-text {
    font-size: 1.25rem;
  }
  
  .brand-logo {
    height: 32px;
    max-width: 150px;
  }
  
  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  /* Hide text on Create New Prompt button on mobile */
  .create-prompt-link span {
    display: none;
  }
  
  .user-dropdown {
    right: 0;
    left: unset;
    min-width: 120px;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 0.75rem;
  }
  
  .brand-text {
    font-size: 1.1rem;
  }
  
  .brand-logo {
    height: 28px;
    max-width: 120px;
  }
  
  .nav-menu {
    gap: 0.25rem;
  }
  
  .nav-link {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  
  .login-link span,
  .create-prompt-link span {
    display: none;
  }
}

/* Focus states for accessibility */
.brand-link:focus,
.nav-link:focus,
.dropdown-link:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.user-dropdown .dropdown-link:focus {
  outline: 2px solid #667eea;
  outline-offset: -2px;
}

/* Hide inner-details element that appears in an ugly way */
.inner-details {
  display: none !important;
}`,

        client_script: `function promptGalleryHeaderController($rootScope, $scope, $window, spUtil, $location, $uibModal, i18n, $document, $timeout) {
    var c = this;
    var userOptionsMessage = i18n.getMessage('User options: {userName}');
    c.userLabel = userOptionsMessage.replace('{userName}', $scope.user.name);
    
    // Set up avatar profile for sn-avatar component
    $scope.avatarProfile = {
        userID: $scope.user.sys_id,
        name: $scope.user.name,
        initials: $window.NOW.user_initials || ($scope.user.name ? $scope.user.name.charAt(0).toUpperCase() : '?')
    };
    
    // Add user avatar image if available
    if ($window.NOW.user_avatar) {
        $scope.avatarProfile.userImage = $window.NOW.user_avatar;
    }

    // Handle dropdown toggle
    $scope.dropdownOpen = false;
    
    $scope.toggleDropdown = function(event) {
        event.preventDefault();
        event.stopPropagation();
        $scope.dropdownOpen = !$scope.dropdownOpen;
        
        // Close dropdown when clicking outside
        if ($scope.dropdownOpen) {
            $timeout(function() {
                $document.on('click.headerDropdown', function(e) {
                    if (!angular.element(e.target).closest('.user-menu-item').length) {
                        $scope.$apply(function() {
                            $scope.dropdownOpen = false;
                        });
                        $document.off('click.headerDropdown');
                    }
                });
            });
        } else {
            $document.off('click.headerDropdown');
        }
    };

    // Login modal function
    $scope.openLogin = function() {
        $scope.modalInstance = $uibModal.open({
            templateUrl: 'spPolarisModalLogin',
            scope: $scope
        });

        var pageRoot = angular.element('.sp-page-root');
        $scope.modalInstance.rendered.then(function() {
            var modal = $scope.modalInstance.modalDomEl;
            modal.attr('aria-label', modal.find('.panel-title').html());
            modal.attr('aria-modal', 'true');
            pageRoot.attr('aria-hidden', 'true');
        });

        $scope.modalInstance.closed.then(function() {
            pageRoot.attr('aria-hidden', 'false');
        });
    };

    // Handle escape key to close dropdown
    $scope.$on('$destroy', function() {
        $document.off('click.headerDropdown');
    });
}`,

        script: `(function() {
    // Get portal record for logo and configuration information
    var portalRecord = $sp.getPortalRecord();
    var urlSuffix = portalRecord.getValue("url_suffix");
    
    // Set up profile portal URL using the Polaris theme utility
    data.supportProfilePortal = new sn_sppolaris_theme.UserProfileUtil().getProfileURL(urlSuffix);
    
    // Login page configuration
    data.login_page = $sp.getValue('login_page');
})();`,

        controller_as: 'c',
        public: true,
    },
})