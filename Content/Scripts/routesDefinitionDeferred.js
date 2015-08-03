(function (Factory, hasFinished, deferred, notify) {
    notify = function (_deferred, _hasFinished) {
        deferred = _deferred; hasFinished = _hasFinished;
        if (deferred !== undefined) {
            if (hasFinished) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        }
    };
    define(['app', 'config/dependencyResolver', 'auth/permissionResolver'], function (app) {
        if (Factory === undefined) {
            app.lazy.provider('RoutesDefinitionDeferred', ['DependencyResolverProvider', 'PermissionResolverProvider', (Factory = function routesDefinitionDeferredProvider(dependencyResolverProvider, permissionResolverProvider) {

                this.map = function ($routeProvider) {

                  (function () {
                    $routeProvider
                    .when("/to-do", resolve({
                        templateUrl: '/Content/Scripts/app/toDo/toDo.html',
                        dependencies: ['auth/authorizationController',
                            'components/app/navMenu/menu',
                            'components/common/form/customValidation',
                            'components/common/toDo/toDo',
                            'components/common/loading/loading'],
                        isPublic: true,
                        title: 'Pilot | Assigning Roles'
                    }));
                  })();

                  $routeProvider.otherwise({
                      redirectTo: '/to-do'
                  });

                  notify(deferred, true);
                };

                function resolve(data) {
                    /*
                    Dependencies must be feeded as requirejs syntax.
                    */
                    //@type dependencies <Array<String>>
                    data.dependencies = data.dependencies || [],
                    //@type isPublic <Booelan>
                    data.isPublic = data.isPublic || (data.isPublic === undefined),
                    //@type title <String>
                    data.title = data.title || undefined;
                    data.resolve = data.resolve || {};
                    data.resolve.load = data.resolve.load || dependencyResolverProvider.$get;
                    data.resolve.permission = data.resolve.permission || permissionResolverProvider.defineResolver('global');
                    return data;
                }

                this.$get = ['$q', function routesDefinitionDeferredFactory($q) {
                    notify($q.defer(), hasFinished);
                    return deferred.promise;
                }];
            })]);
        }

        return Factory;
    });
})();
