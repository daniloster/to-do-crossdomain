(function () {
    var Ctrl = null, instance = null;
    define(['angular', 'app'], function (angular, app) {
        if (Ctrl == null) {
            var steps = [], currentIndex = -1;
            instance = {
                clear: function () {
                    steps = [];
                    currentIndex = -1;
                },
                set: function (_steps) {
                    if (!!_steps && _steps.length > -1) {
                        steps = _steps;
                    } else {
                        throw new Error('You cannot set invalid workflow steps.');
                    }
                },
                moveTo: function (idx) {
                    if (idx > -1 && idx < steps.length) {
                        currentIndex = idx;
                        return instance.current();
                    }
                    return null;
                },
                current: function () {
                    return currentIndex > -1 && currentIndex < steps.length ? steps[currentIndex] : null;
                },
                moveNext: function ($location) {
                    $location.path(instance.moveTo(currentIndex + 1).path);
                    instance.onMoveNext = null;
                },
                movePrevious: function ($location) {
                    $location.path(instance.moveTo(currentIndex - 1).path);
                    instance.onMoveNext = null;
                }
            };

            app.lazy.factory('WorkflowService', function() {
              return instance;
            });

            Ctrl = ['$scope', '$rootScope', '$location', 'WorkflowService', function ($scope, $rootScope, $location, workflowService) {
                var isMoveNextValid = true;
                $scope.items = steps.filter(function (item, idx) {
                    return idx > 0;
                });
                $scope.currentStep = instance.current();
                $scope.lastStep = $scope.items.length ? $scope.items[$scope.items.length - 1] : undefined;
                $scope.secondLastStep = $scope.items.length > 1 ? $scope.items[$scope.items.length - 2] : undefined;

                $scope.hideAll = !!$scope.lastStep && $scope.lastStep.name == $scope.currentStep.name;

                $scope.isLastMove = !!$scope.secondLastStep && $scope.secondLastStep.name == $scope.currentStep.name;

                $scope.movePrevious = function () {
                    workflowService.movePrevious($location);
                };

                $scope.moveNext = function () {
                    isMoveNextValid = true;
                    $rootScope.$broadcast('Workflow:get_IsMoveNextValid');
                    if (isMoveNextValid) {
                        if (angular.isFunction(workflowService.onMoveNext)) {
                            workflowService.onMoveNext(function () { workflowService.moveNext($location); });
                        } else {
                            workflowService.moveNext($location);
                        }
                    }
                };

            }];
            app.lazy.controller('WorkflowFooterController', Ctrl);
        }

        return instance;
    });
})();
