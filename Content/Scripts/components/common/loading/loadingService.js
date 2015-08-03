(function () {
    var loaded = false,
        hasLoads = [], overlay = false;
    define(['app'], function (app) {
        if (!loaded) {

          app.lazy.factory('LoadingService', function() {
            return {
                clear: function (hasOverlay) {
                    hasLoads = [];
                    overlay = !!hasOverlay;
                },
                isLoading: function () {
                    return hasLoads.length > 0;;
                },
                startLoading: function () {
                    hasLoads.push(1);
                },
                stopLoading: function () {
                    hasLoads.pop();
                },
                hasOverlay: function () {
                    return overlay;
                },
                enableOverlay: function () {
                    overlay = true;
                },
                disableOverlay: function () {
                    overlay = false;
                }
            }
          });

          loaded = true;
        }
    });
})();
