(() => {
    'use strict';

    const app = angular.module('SfMuni');

    app.controller('VisualizationController', VisualizationController);

    VisualizationController.$inject = ['SFMuniDataService', '$interval']

    function VisualizationController(SFMuniDataService, $interval) {

        let visualcontroller = this;
        visualcontroller.data = [];
        visualcontroller.showRoute = false;
        let subroute = false;
        visualcontroller.subroute = "";
        let all_routes = {};
        visualcontroller.showMessage = false;
        visualcontroller.routeName = "";
        visualcontroller.routeMessage = false;

        /**
         * Gets all the routes and stores them locally
         * @type {Array}
         */

        SFMuniDataService.getRoutes().then((data) => {
            data.forEach((obj) => {
                visualcontroller.routeName += obj.tag + ", ";
                all_routes[obj.tag] = 1;
            })
        }).catch(() => {
            all_routes = [];
        });

        /**
         * Gets the initial bus data on loading of page
         * @type {[type]}
         */

        SFMuniDataService.getData().then((data) => {
            visualcontroller.data = data;
        }).catch((error) => {
            visualcontroller.data = [];
        });

        /**
         * Gets Subroute data of the route selected. Shows Error Message if the route selected does not exist or if the route selected has no buses currently running.
         * @return {[type]} [description]
         */

        visualcontroller.GetSubRoute = function() {
            visualcontroller.showMessage = false;
            if (visualcontroller.subroute && visualcontroller.subroute in all_routes) {
                SFMuniDataService.getSubRouteData(visualcontroller.subroute).then((data) => {
                    if (data) {
                        visualcontroller.data = data;
                        subroute = true;
                    } else {
                        visualcontroller.showMessage = true;
                        visualcontroller.message = "Please Select Another Route. No Buses are running on the route currently";
                    }
                }).catch((error) => {
                    visualcontroller.data = [];
                });

            } else {
                visualcontroller.showMessage = true;
                visualcontroller.message = "Please Select an avaliable Route. This route Does not Exist.";
            }
        }

        /**
         * Reset button controller to switch back to showing all buses
         * @return {[type]} [description]
         */

        visualcontroller.Reset = function() {
            visualcontroller.showMessage = false;
            subroute = false;
        }

        visualcontroller.Routes = function() {
        }
        /**
         * gets new data every 15 seconds
         * @param  {[type]} setMuniData [description]
         * @param  {[type]} function    [description]
         * @return {[type]}             [description]
         */
        $interval(() => {
            setMuniData();
        }, 15000)


        /**
         * Function gets the new bus data or subroute bus data
         */
        function setMuniData() {
            if (subroute) {
                SFMuniDataService.getSubRouteData(visualcontroller.subroute).then((data) => {
                    visualcontroller.data = data;
                }).catch(() => {
                    visualcontroller.data = [];
                });
            } else {
                SFMuniDataService.getData().then((data) => {
                    visualcontroller.data = data;
                }).catch((error) => {
                    visualcontroller.data = [];
                });
            }
        }

    }
})();
