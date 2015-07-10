(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/loading/loadingController'], function (angular, app, loadingController) {
        if (!loaded) {
            app.lazy.directive("toDo", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/toDo/style.css')));
                return {
                    controller: ['$scope', function ($scope) {
                      $scope.tasks = [{id: 1, text: 'hello world!'}, {id: 2, text: 'get your shit together and move on!'}]
                    }],
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/toDo/template.html'),
                    scope: {
                        token: "=toDo",
                        tasks: "=?toDoTasks"
                    }
                };
            }]);
            loaded = true;
        }
    });
})();
