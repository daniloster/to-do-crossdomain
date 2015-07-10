(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/loading/loadingController', 'components/common/form/statusMessage'], function (angular, app, loadingController) {
        if (!loaded) {
            app.lazy.factory('ToDoService', ['$http', 'ConfigApp', function($http, ConfigApp){
                return {
                  auth: function(user) {
                    return $http.post(ConfigApp.getPath('/api/auth'), user);
                  },
                  straightAccess: function(user) {
                    return $http.post(ConfigApp.getPath('/api/auth-straight'), user);
                  },
                  getTasks: function() {
                    return $http.post(ConfigApp.getPath('/api/tasks'));
                  },
                  addTask: function(task) {
                    return $http.post(ConfigApp.getPath('/api/add-task'), task);
                  },
                  removeTask: function(id) {
                    return $http.post(ConfigApp.getPath('/api/remove-task/'+id));
                  },
                  toggleTask: function(id) {
                    return $http.post(ConfigApp.getPath('/api/toggle-task/'+id));
                  }
                };
            }]);
            app.lazy.directive("toDo", ['ConfigApp', function (ConfigApp) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/toDo/style.css')));
                return {
                    controller: ['$scope', '$rootScope', 'ToDoService', function ($scope, $rootScope, toDoService) {
                      $scope.auth = function(){
                        toDoService.straightAccess({ userName: $scope.token })
                        .success(function(data){
                          $scope.user = data;
                          $scope.tasks = data.tasks;
                        }).error(function(data){
                          $scope.user = null;
                          $scope.tasks = null;
                          $rootScope.updateErrorMessage(data.message);
                        });
                      };

                      $scope.saveTask = function(){
                        $rootScope.clearMessages();
                        toDoService.addTask($scope.newOne)
                        .success(function(data){
                          $scope.newOne = {};
                          $rootScope.updateSuccessMessage(data.message);
                          $scope.getTasks();
                        })
                        .error(function(data){
                          $rootScope.updateErrorMessage(data.message);
                        })
                      };

                      $scope.removeTask = function(id){
                        $rootScope.clearMessages();
                        toDoService.removeTask(id)
                        .success(function(data){
                          $rootScope.updateSuccessMessage(data.message);
                          $scope.getTasks();
                        })
                        .error(function(data){
                          $rootScope.updateErrorMessage(data.message);
                        })
                      };

                      $scope.toggleTask = function(id){
                        $rootScope.clearMessages();
                        toDoService.toggleTask(id)
                        .success(function(data){
                          $scope.getTasks();
                          $rootScope.updateSuccessMessage(data.message);
                        })
                        .error(function(data){
                          $rootScope.updateErrorMessage(data.message);
                        })
                      };

                      $scope.getTasks = function(id){
                        toDoService.getTasks()
                        .success(function(data){
                          $scope.tasks = data;
                        })
                        .error(function(data){
                          $rootScope.updateErrorMessage(data.message);
                        })
                      };
                      $scope.tasks = [{id: 1, text: 'hello world!'}, {id: 2, text: 'get your shit together and move on!'}]
                    }],
                    restrict: 'EA',
                    templateUrl: ConfigApp.getPath('/Content/Scripts/components/common/toDo/template.html'),
                    scope: {
                        token: "@toDo",
                        tasks: "=?toDoTasks"
                    },
                    link: function($scope) {
                      $scope.auth();
                    }
                };
            }]);
            loaded = true;
        }
    });
})();
