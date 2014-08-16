var EmployeeApp = angular.module('EmployeeApp', [
    'ui.router', 
    'ngResource', 
    'EmployeeControllers'
]);

EmployeeApp.config([
    '$urlRouterProvider',
    '$stateProvider',
    function($urlRouterProvider, $stateProvider){
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home',{
            url: '/',
            templateUrl: '/partials/list.html',
            controller: 'listCtrl'
        }).state('edit',{
            url: '/edit/:id',
            templateUrl: '/partials/details.html',
            controller: 'editCtrl'
        }).state('create',{
            url: '/new',
            templateUrl: '/partials/details.html',
            controller: 'createCtrl'
        }).state('about',{
            url: '/about',
            templateUrl: '/partials/about.html'
        });
    }
]);

EmployeeApp.factory('EmployeeService',[
    '$resource',
    function ($resource){
        return $resource('/api/employee/:id', {id: '@id'}, {update: {method: 'PUT'}});

    }
]);

