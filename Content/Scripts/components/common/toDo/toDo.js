﻿(function () {
    var loaded = false;
    define(['angular', 'app', 'components/common/loading/loadingService', 'components/common/form/statusMessage'], function (angular, app) {
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

            app.lazy.directive("toDo", ['LoadingService', 'ConfigApp', function (ConfigApp, loadingService) {
                angular.element('body').after(angular.element(ConfigApp.getElementLink('/Content/Scripts/components/common/toDo/style.css')));
                return {
                    controller: ['$scope', '$rootScope', 'ToDoService', function ($scope, $rootScope, toDoService) {
                      $scope.auth = function(){
                        loadingService.startLoading();
                        toDoService.straightAccess({ userName: $scope.token })
                        .success(function(data){
                          $scope.user = data;
                          $scope.tasks = data.tasks;
                          $scope.refreshTotals();
                          loadingService.stopLoading();
                        }).error(function(data){
                          $scope.user = null;
                          $scope.tasks = null;
                          $scope.refreshTotals();
                          loadingService.stopLoading();
                          $rootScope.updateErrorMessage(data.message);
                        });
                      };

                      $scope.saveTask = function(){
                        loadingService.startLoading();
                        $rootScope.clearMessages();
                        toDoService.addTask($scope.newOne)
                        .success(function(data){
                          $scope.newOne = {};
                          $rootScope.updateSuccessMessage(data.message);
                          $scope.getTasks();
                          loadingService.stopLoading();
                        })
                        .error(function(data){
                          loadingService.stopLoading();
                          $rootScope.updateErrorMessage(data.message);
                        })
                      };

                      $scope.removeTask = function(id){
                        loadingService.startLoading();
                        $rootScope.clearMessages();
                        toDoService.removeTask(id)
                        .success(function(data){
                          $rootScope.updateSuccessMessage(data.message);
                          $scope.getTasks();
                          loadingService.stopLoading();
                        })
                        .error(function(data){
                          loadingService.stopLoading();
                          $rootScope.updateErrorMessage(data.message);
                        })
                      };

                      $scope.toggleTask = function(id){
                        loadingService.startLoading();
                        $rootScope.clearMessages();
                        toDoService.toggleTask(id)
                        .success(function(data){
                          $scope.getTasks();
                          loadingService.stopLoading();
                          $rootScope.updateSuccessMessage(data.message);
                        })
                        .error(function(data){
                          loadingService.stopLoading();
                          $rootScope.updateErrorMessage(data.message);
                        })
                      };

                      $scope.getTasks = function(id){
                        loadingService.startLoading();
                        toDoService.getTasks()
                        .success(function(data){
                          $scope.tasks = data;
                          $scope.refreshTotals();
                          loadingService.stopLoading();
                        })
                        .error(function(data){
                          $scope.tasks = null;
                          $scope.refreshTotals();
                          loadingService.stopLoading();
                          $rootScope.updateErrorMessage(data.message);
                        })
                      };

                      $scope.refreshTotals = function(){
                        $scope.remaining = Object.keys($scope.tasks || {}).filter(function(item){ return !!$scope.tasks && $scope.tasks[item] && !$scope.tasks[item].done; }).length;
                        $scope.totalTasks = Object.keys($scope.tasks || {}).length;
                      };
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
