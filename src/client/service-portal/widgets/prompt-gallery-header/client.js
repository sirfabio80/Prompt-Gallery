function PromptGalleryHeaderController($scope, $window) {
  var c = this;

  // Initialize controller
  c.$onInit = function() {

    
    // Any initialization logic can go here
  };

  // Handle navigation item clicks
  c.handleNavClick = function(item, event) {
    if (item.action) {
      event.preventDefault();
      // Handle custom actions here
      switch (item.action) {
        case 'search':
          // Emit search event to other widgets
          $scope.$broadcast('prompt.search.focus');
          break;
        case 'refresh':
          // Emit refresh event
          $scope.$broadcast('prompt.refresh');
          break;
        default:
          // Handle other custom actions
          break;
      }
    }
    // For regular href links, let the default behavior happen
  };
}