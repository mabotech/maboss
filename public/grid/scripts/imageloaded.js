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

angular.module('kanban.deckgrid').directive('imageloaded', [

    function () {

        'use strict';

        return {
            restrict: 'A',

            link: function(scope, element, attrs) {   
                var cssClass = attrs.loadedclass;

                element.bind('load', function (e) {
                    angular.element(element).addClass(cssClass);
                });
            }
        }
    }
]);