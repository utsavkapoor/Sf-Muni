(() => {
    'use strict';

    const app = angular.module('SfMuni');

    app.factory('DrawBusesFactory',DrawBusesFactory);

    DrawBusesFactory.$inject = ['SFMuniDataService','$q'];
/**
 * returns a function that is used to draw buses and routes on tha map.
 * @param       {[Anglarjs Service]} SFMuniDataService [description]
 * @param       {[Angularjs Promise]} $q                [description]
 * @constructor
 */
    function DrawBusesFactory(SFMuniDataService,$q){
        const factory = function (){
            return new DrawBusesService(SFMuniDataService,$q);
        }
        return factory;
    }


    function DrawBusesService(SFMuniDataService,$q){
        const buses = this;

        buses.route_path = [];

        /**
         * Maps the buses in the map
         * @param  {[d3 svg]} muniSVG      [description]
         * @param  {[array of objects]} vehicle_data [description]
         * @param  {[d3 projection]} projection   [description]
         * @return {[type]}              [description]
         */
        buses.updateBuses = (muniSVG,vehicle_data,projection) => {
            const buses = muniSVG.selectAll('.muni').data(vehicle_data, (d) => {
                return d.id;
            });
            buses.exit().remove();

            buses.enter().append('circle').attr('r',3).attr('fill','#31558d').attr('fill-opacity','0.8');

            buses.attr('class','muni').attr("cx", (d)=> {
                return projection([d.lon,d.lat])[0];
            })
            .attr("cy", (d) => {
                return projection([d.lon,d.lat])[1];
            });
        };

        /**
         * [updateRoutes description]
         * @param  {[d3 svg]} muniSVG    [description]
         * @param  {[bool]} show_route      [Checks if we have to show Routes or Remove them]
         * @param  {[d3 projection]} projection [description]
         * @return {[type]}            [description]
         */

        buses.updateRoutes = (muniSVG,show_route,projection) => {
            if(buses.route_path.length == 0){
                return true;
            }
            if(show_route){
                const lineFunction = d3.svg.line()
                .x((d)=>{
                    return projection([d.lon,d.lat])[0];
                })
                .y((d) => {
                    return projection([d.lon,d.lat])[1];
                })
                .interpolate('linear');

                const routes = muniSVG.append("g");
                buses.route_path.forEach((obj) => {
                    routes.append("path").attr("d",lineFunction(obj)).attr("class","route").attr("fill","none").attr("stroke","#FDA50F").attr("stroke-width",0.5).attr("stroke-opactiy",0.5);
                })

            } else {
                muniSVG.selectAll('.route').remove();
            }
            return false;
        }

        /**
         * Function started when page is loaded and gets all the route data and stores it locally which is used later to map routes on the map
         */

        buses.setRouteData = () => {
            let route_object =  SFMuniDataService.routeList;
            let promises = [];
            Object.keys(route_object).forEach((key) => {
                let promise = SFMuniDataService.getRouteConfig(key);
                promises.push(promise);
            });
            $q.all(promises).then (data => {
                data.forEach((obj) => {
                    buses.route_path.push(obj);
                });

            });
        }

    }
})();
