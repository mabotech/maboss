/*
 * angular-deckgrid-demo
 *
 * Copyright(c) 2013 Andr¨¦ K?nig <akoenig@posteo.de>
 * MIT Licensed
 *
 */

/**
 * @author Andr¨¦ K?nig (andre.koenig@posteo.de)
 *
 */

angular.module('kanban.deckgrid', [
    'ngRoute',
    'angular-flot',
    'akoenig.deckgrid',
 
]);

angular.module('kanban.deckgrid').config([

    '$routeProvider',
   // 'flot',


    function configure ($routeProvider) {

        'use strict';

        $routeProvider.when('/', {
            controller: 'HomeController',
            templateUrl: 'templates/home.html'
        });

    }
]);