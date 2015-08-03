(function () {
    var Ctrl = null, instance = null,
        hasLoads = [], overlay = false;
    define(['app', 'components/common/loading/loadingService'], function (app) {
        if (Ctrl == null) {

          Ctrl = ['$scope', 'LoadingService', function ($scope, loadingService) {

              $scope.isLoading = function () {
                  return loadingService.isLoading();
              };

              $scope.hasOverlay = function () {
                  return loadingService.hasOverlay();
              };
          }];

          app.lazy.controller('LoadingController', Ctrl);
        }

        return instance;
    });
})();
