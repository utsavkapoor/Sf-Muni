(() => {
    'use strict';

    const app = angular.module('SfMuni',['d3','ui.router']);

    app.config(RouterConfig);

    RouterConfig.$inject = ['$stateProvider','$urlRouterProvider'];

    /**
     * Routes the page always to '/'
     * @param       {[type]} $stateProvider     [description]
     * @param       {[type]} $urlRouterProvider [description]
     * @constructor
     */

    function RouterConfig($stateProvider,$urlRouterProvider){
        // Default
        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('/', {
          url:'/',
          templateUrl:'./public/views/homepage.html',
          controller: 'VisualizationController as controller1',
        })
    }
})();
