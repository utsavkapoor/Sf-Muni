(() => {
    'use strict';

    const app = angular.module('SfMuni');

    app.service('SFMuniDataService',SFMuniDataService);

    SFMuniDataService.$inject = ['$http','$q'];

    function SFMuniDataService($http,$q){
        const url = "http://webservices.nextbus.com/service/publicJSONFeed";
        const munidata = this;
        const route_list = [];

        munidata.routeList = [];

        /**
         * Gets all the Possible routes of SF-MUNI
         * @return {[Promise]} [description]
         */

        munidata.getRoutes = function() {
            return $http.get(url, {
                params: {
                    command: "routeList",
                    a:"sf-muni"
                }
            }).then((response) =>{
                munidata.routeList = response.data.route;
                return response.data.route;
            }).catch(() => {
                console.log(error);
                return [];
            });
        }

        /**
         * Returns all the route configuration that is used to map a route on the Map
         * @param  {[string]} route_tag [description]
         * @return {[Promise]}           [description]
         */

        munidata.getRouteConfig = (route_tag) => {
            return $http.get(url, {
                params: {
                    command:"routeConfig",
                    a:"sf-muni",
                    r: route_tag
                }
            }).then((response) => {
                return response.data.route.stop;
            }).catch(() => {
                return [];
            });
        }
        /**
         * Gets the data of all the buses in SF.
         * @return {[Promise]} [description]
         */
        munidata.getData = function(){
            let time = new Date().valueOf() - 60000;
                return $http.get(url,{
                    params: {
                        command:"vehicleLocations",
                        a:"sf-muni",
                        t:time
                    }
                }).then( (response) => {
                    return response.data.vehicle;
                }).catch((error) => {
                    console.log(error);
                    return [];
                });
        };
        /**
         * Gets the Bus data on a specific route
         * @param  {[string]} subroute [subroute tag example - N]
         * @return {[Promise]}          [Promise with bus data on that route]
         */
        munidata.getSubRouteData = function(subroute){
            let time = new Date().valueOf() - 60000;
            return $http.get(url,{
                params: {
                    command:"vehicleLocations",
                    a:"sf-muni",
                    t:time,
                    r:subroute
                }
            }).then( (response) => {
                return response.data.vehicle;
            }).catch((error) => {
                console.log(error);
                return [];
            });
        };

    }
})();
