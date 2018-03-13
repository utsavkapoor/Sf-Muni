(() => {
    'use strict';

    const app = angular.module('SfMuni');

    app.directive('map', map);
    map.$inject = ['d3Service','DrawBusesFactory'];

    /**
     * Angularjs Directive used to draw map, buses and routes
     * @param  {[Angularjs Service]} d3Service        [description]
     * @param  {[Angularjs Factory]} DrawBusesFactory [description]
     * @return {[type]}                  [description]
     */

    function map(d3Service,DrawBusesFactory) {
        const ddo = {
            restrict: 'AE',
            templateUrl: '',
            scope: {
                data: '=',
                showRoute: '=',
                routeMessage: '='
            },
            link: link,
        };

        function link(scope, element, attrs) {

            let vehicle_data = [];
            const width = element[0].style.width;
            const height = element[0].style.height;
            const DrawBusService = DrawBusesFactory();
            const baseMapCenter = [-122.433701, 37.767683];
            const baseScale =200000;

            /**
             * Only run the belowe function after d3 has been added to the page
             * @param  {[type]} d3 [description]
             * @return {[type]}    [description]
             */

            d3Service.d3().then(function(d3) {
                const svg = d3.select('.map-box').append('svg').attr('width', '100%').attr('height','500px');
                const projection  = d3.geo.mercator().rotate([0,0]).scale(baseScale).center(baseMapCenter);
                vehicle_data = scope.data;
                const muniSVG = svg.append('g');
                draw_map(svg,projection);

                /**
                 * Angularjs watcher watches if the bus data is changed. if yes, runs the function to update the map.
                 * @type {[type]}
                 */

                scope.$watch('data', (newVals, oldVals) => {
                    vehicle_data = newVals;
                    if(oldVals.length != 0){
                        DrawBusService.updateBuses(muniSVG,vehicle_data,projection);
                    }
                }, true);

                /**
                 * Angularjs watcher watches if the route data has to be shown or not
                 * @type {[type]}
                 */

                scope.$watch('showRoute', (newVals,oldVals) => {
                    if(newVals === oldVals){
                        // init block
                        scope.routeMessage = false;
                        DrawBusService.setRouteData();
                    }else {
                        scope.routeMessage = DrawBusService.updateRoutes(svg,newVals,projection);}
                },true);
            });

            /**
             * Draws the Map of SF using GeoJSON
             * @param  {[d3 svg]} svg        [description]
             * @param  {[d3 projection]} projection [description]
             * @return {[type]}            [description]
             */

            function draw_map(svg,projection){
                const zoom = d3.behavior.zoom().scaleExtent([-1,2]);
                d3.json('./public/sfmaps/streets.json', (err,json) => {
                    draw_map_json(svg,json,'street',projection);
                    d3.json('./public/sfmaps/freeways.json', (err,json) => {
                        draw_map_json(svg,json,'freeways',projection);
                        d3.json('./public/sfmaps/neighborhoods.json', (err,json) => {
                            draw_map_json(svg,json,'neighborhood',projection);
                            d3.json('./public/sfmaps/arteries.json', (err,json) => {
                                draw_map_json(svg,json,'arteries',projection);
                            });
                        })
                    });
                });

            }

            /**
             * Function drawing the map
             * @param  {[d3 svg]} svg        [description]
             * @param  {[json]} json       [GeoJSON being used to draw the map]
             * @param  {[string]} cssClasses [Class we need to add to GeoJSON]
             * @param  {[d3 projection]} projection [description]
             * @return {[type]}            [description]
             */

            function draw_map_json(svg,json,cssClasses,projection) {
                const path = d3.geo.path().projection(projection);

                const features = svg.append('g').append('path').datum(json).attr('class',cssClasses).style('fill','none').attr('d',path);
            };
        }


        return ddo;
    }
})();
