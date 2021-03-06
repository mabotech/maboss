// Generated by CoffeeScript 1.7.1

/*
 * Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
 * Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
 * Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * File: modules/kanban/main.coffee
 */

(function() {
  var KanbanColumnHeightFixerDirective, KanbanController, KanbanDirective, KanbanSquishColumnDirective, KanbanUserDirective, KanbanUserstoryDirective, KanbanWipLimitDirective, bindMethods, bindOnce, defaultViewMode, defaultViewModes, groupBy, mixOf, module, scopeDefer, taiga, timeout, toggleText,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  taiga = this.taiga;

  mixOf = this.taiga.mixOf;

  toggleText = this.taiga.toggleText;

  scopeDefer = this.taiga.scopeDefer;

  bindOnce = this.taiga.bindOnce;

  groupBy = this.taiga.groupBy;

  timeout = this.taiga.timeout;

  bindMethods = this.taiga.bindMethods;

  module = angular.module("taigaKanban");

  defaultViewMode = "maximized";

  defaultViewModes = {
    maximized: {
      cardClass: "kanban-task-maximized"
    },
    minimized: {
      cardClass: "kanban-task-minimized"
    }
  };

  KanbanController = (function(_super) {
    __extends(KanbanController, _super);

    KanbanController.$inject = ["$scope", "$rootScope", "$tgRepo", "$tgConfirm", "$tgResources", "$routeParams", "$q", "$tgLocation", "$appTitle", "$tgNavUrls", "$tgEvents", "$tgAnalytics", "tgLoader"];

    function KanbanController(scope, rootscope, repo, confirm, rs, params, q, location, appTitle, navUrls, events, analytics, tgLoader) {
      var promise;
      this.scope = scope;
      this.rootscope = rootscope;
      this.repo = repo;
      this.confirm = confirm;
      this.rs = rs;
      this.params = params;
      this.q = q;
      this.location = location;
      this.appTitle = appTitle;
      this.navUrls = navUrls;
      this.events = events;
      this.analytics = analytics;
      bindMethods(this);
      this.scope.sectionName = "Kanban";
      this.scope.statusViewModes = {};
      this.initializeEventHandlers();
      promise = this.loadInitialData();
      promise.then((function(_this) {
        return function() {
          _this.appTitle.set("Kanban - " + _this.scope.project.name);
          return tgLoader.pageLoaded();
        };
      })(this));
      promise.then(null, this.onInitialDataError.bind(this));
    }

    KanbanController.prototype.initializeEventHandlers = function() {
      this.scope.$on("usform:new:success", (function(_this) {
        return function() {
          _this.loadUserstories();
          _this.refreshTagsColors();
          return _this.analytics.trackEvent("userstory", "create", "create userstory on kanban", 1);
        };
      })(this));
      this.scope.$on("usform:bulk:success", (function(_this) {
        return function() {
          _this.loadUserstories();
          return _this.analytics.trackEvent("userstory", "create", "bulk create userstory on kanban", 1);
        };
      })(this));
      this.scope.$on("usform:edit:success", (function(_this) {
        return function() {
          _this.loadUserstories();
          return _this.refreshTagsColors();
        };
      })(this));
      this.scope.$on("assigned-to:added", this.onAssignedToChanged);
      return this.scope.$on("kanban:us:move", this.moveUs);
    };

    KanbanController.prototype.addNewUs = function(type, statusId) {
      switch (type) {
        case "standard":
          return this.rootscope.$broadcast("usform:new", this.scope.projectId, statusId, this.scope.usStatusList);
        case "bulk":
          return this.rootscope.$broadcast("usform:bulk", this.scope.projectId, statusId);
      }
    };

    KanbanController.prototype.changeUsAssignedTo = function(us) {
      return this.rootscope.$broadcast("assigned-to:add", us);
    };

    KanbanController.prototype.onAssignedToChanged = function(ctx, userid, us) {
      var promise;
      us.assigned_to = userid;
      promise = this.repo.save(us);
      return promise.then(null, function() {
        return console.log("FAIL");
      });
    };

    KanbanController.prototype.loadProjectStats = function() {
      return this.rs.projects.stats(this.scope.projectId).then((function(_this) {
        return function(stats) {
          var completedPercentage;
          _this.scope.stats = stats;
          if (stats.total_points) {
            completedPercentage = Math.round(100 * stats.closed_points / stats.total_points);
          } else {
            completedPercentage = 0;
          }
          _this.scope.stats.completedPercentage = "" + completedPercentage + "%";
          return stats;
        };
      })(this));
    };

    KanbanController.prototype.refreshTagsColors = function() {
      return this.rs.projects.tagsColors(this.scope.projectId).then((function(_this) {
        return function(tags_colors) {
          return _this.scope.project.tags_colors = tags_colors;
        };
      })(this));
    };

    KanbanController.prototype.loadUserstories = function() {
      return this.rs.userstories.listAll(this.scope.projectId).then((function(_this) {
        return function(userstories) {
          var status, _i, _len, _ref;
          _this.scope.userstories = userstories;
          _this.scope.usByStatus = _.groupBy(userstories, "status");
          _ref = _this.scope.usStatusList;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            status = _ref[_i];
            if (_this.scope.usByStatus[status.id] == null) {
              _this.scope.usByStatus[status.id] = [];
            }
            _this.scope.usByStatus[status.id] = _.sortBy(_this.scope.usByStatus[status.id], "kanban_order");
          }
          scopeDefer(_this.scope, function() {
            return _this.scope.$broadcast("userstories:loaded");
          });
          return userstories;
        };
      })(this));
    };

    KanbanController.prototype.loadKanban = function() {
      return this.q.all([this.refreshTagsColors(), this.loadProjectStats(), this.loadUserstories()]);
    };

    KanbanController.prototype.loadProject = function() {
      return this.rs.projects.get(this.scope.projectId).then((function(_this) {
        return function(project) {
          _this.scope.project = project;
          _this.scope.points = _.sortBy(project.points, "order");
          _this.scope.pointsById = groupBy(project.points, function(x) {
            return x.id;
          });
          _this.scope.usStatusById = groupBy(project.us_statuses, function(x) {
            return x.id;
          });
          _this.scope.usStatusList = _.sortBy(project.us_statuses, "order");
          _this.generateStatusViewModes();
          _this.scope.$emit("project:loaded", project);
          return project;
        };
      })(this));
    };

    KanbanController.prototype.initializeSubscription = function() {
      var routingKey1;
      routingKey1 = "changes.project." + this.scope.projectId + ".userstories";
      return this.events.subscribe(this.scope, routingKey1, (function(_this) {
        return function(message) {
          return _this.loadUserstories();
        };
      })(this));
    };

    KanbanController.prototype.loadInitialData = function() {
      var promise;
      promise = this.repo.resolve({
        pslug: this.params.pslug
      }).then((function(_this) {
        return function(data) {
          _this.scope.projectId = data.project;
          _this.initializeSubscription();
          return data;
        };
      })(this));
      return promise.then((function(_this) {
        return function() {
          return _this.loadProject();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.loadUsersAndRoles();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.loadKanban();
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.scope.$broadcast("redraw:wip");
        };
      })(this));
    };

    KanbanController.prototype.generateStatusViewModes = function() {
      var mode, status, storedStatusViewModes, _i, _len, _ref;
      storedStatusViewModes = this.rs.kanban.getStatusViewModes(this.scope.projectId);
      this.scope.statusViewModes = {};
      _ref = this.scope.usStatusList;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        status = _ref[_i];
        mode = storedStatusViewModes[status.id];
        this.scope.statusViewModes[status.id] = _.has(defaultViewModes, mode) ? mode : defaultViewMode;
      }
      return this.storeStatusViewModes();
    };

    KanbanController.prototype.storeStatusViewModes = function() {
      return this.rs.kanban.storeStatusViewModes(this.scope.projectId, this.scope.statusViewModes);
    };

    KanbanController.prototype.updateStatusViewMode = function(statusId, newViewMode) {
      this.scope.statusViewModes[statusId] = newViewMode;
      return this.storeStatusViewModes();
    };

    KanbanController.prototype.getCardClass = function(statusId) {
      var mode;
      mode = this.scope.statusViewModes[statusId] || defaultViewMode;
      return defaultViewModes[mode].cardClass || defaultViewModes[defaultViewMode].cardClass;
    };

    KanbanController.prototype.prepareBulkUpdateData = function(uses, field) {
      if (field == null) {
        field = "kanban_order";
      }
      return _.map(uses, function(x) {
        return {
          "us_id": x.id,
          "order": x[field]
        };
      });
    };

    KanbanController.prototype.resortUserStories = function(uses) {
      var index, item, items, _i, _len;
      items = [];
      for (index = _i = 0, _len = uses.length; _i < _len; index = ++_i) {
        item = uses[index];
        item.kanban_order = index;
        if (item.isModified()) {
          items.push(item);
        }
      }
      return items;
    };

    KanbanController.prototype.moveUs = function(ctx, us, statusId, index) {
      var itemsToSave, promise, r;
      if (us.status !== statusId) {
        r = this.scope.usByStatus[us.status].indexOf(us);
        this.scope.usByStatus[us.status].splice(r, 1);
        this.scope.usByStatus[statusId].splice(index, 0, us);
        us.status = statusId;
      } else {
        r = this.scope.usByStatus[statusId].indexOf(us);
        this.scope.usByStatus[statusId].splice(r, 1);
        this.scope.usByStatus[statusId].splice(index, 0, us);
      }
      itemsToSave = this.resortUserStories(this.scope.usByStatus[statusId]);
      this.scope.usByStatus[statusId] = _.sortBy(this.scope.usByStatus[statusId], "kanban_order");
      promise = this.repo.save(us);
      promise = promise.then((function(_this) {
        return function() {
          var data;
          itemsToSave = _.reject(itemsToSave, {
            "id": us.id
          });
          data = _this.prepareBulkUpdateData(itemsToSave);
          return _this.rs.userstories.bulkUpdateKanbanOrder(us.project, data).then(function() {
            return itemsToSave;
          });
        };
      })(this));
      return promise;
    };

    return KanbanController;

  })(mixOf(taiga.Controller, taiga.PageMixin, taiga.FiltersMixin));

  module.controller("KanbanController", KanbanController);

  KanbanDirective = function($repo, $rootscope) {
    var link;
    link = function($scope, $el, $attrs) {
      var tableBodyDom;
      tableBodyDom = $el.find(".kanban-table-body");
      tableBodyDom.on("scroll", function(event) {
        var tableHeaderDom, target;
        target = angular.element(event.currentTarget);
        tableHeaderDom = $el.find(".kanban-table-header .kanban-table-inner");
        return tableHeaderDom.css("left", -1 * target.scrollLeft());
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgKanban", ["$tgRepo", "$rootScope", KanbanDirective]);

  KanbanColumnHeightFixerDirective = function() {
    var link, mainPadding, renderSize, scrollPadding;
    mainPadding = 32;
    scrollPadding = 0;
    renderSize = function($el) {
      var columnHeight, elementOffset, windowHeight;
      elementOffset = $el.parent().parent().offset().top;
      windowHeight = angular.element(window).height();
      columnHeight = windowHeight - elementOffset - mainPadding - scrollPadding;
      return $el.css("height", "" + columnHeight + "px");
    };
    link = function($scope, $el, $attrs) {
      timeout(500, function() {
        return renderSize($el);
      });
      $scope.$on("resize", function() {
        return renderSize($el);
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgKanbanColumnHeightFixer", KanbanColumnHeightFixerDirective);

  KanbanUserstoryDirective = function($rootscope) {
    var link;
    link = function($scope, $el, $attrs, $model) {
      $el.disableSelection();
      $scope.$watch("us", function(us) {
        if (us.is_blocked && !$el.hasClass("blocked")) {
          return $el.addClass("blocked");
        } else if (!us.is_blocked && $el.hasClass("blocked")) {
          return $el.removeClass("blocked");
        }
      });
      $el.find(".icon-edit").on("click", function(event) {
        if ($el.find(".icon-edit").hasClass("noclick")) {
          return;
        }
        return $scope.$apply(function() {
          return $rootscope.$broadcast("usform:edit", $model.$modelValue);
        });
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      templateUrl: "/partials/views/components/kanban-task.html",
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgKanbanUserstory", ["$rootScope", KanbanUserstoryDirective]);

  KanbanSquishColumnDirective = function(rs) {
    var link;
    link = function($scope, $el, $attrs) {
      var updateTableWidth;
      $scope.$on("project:loaded", function(event, project) {
        $scope.folds = rs.kanban.getStatusColumnModes(project.id);
        return updateTableWidth();
      });
      $scope.foldStatus = function(status) {
        $scope.folds[status.id] = !!!$scope.folds[status.id];
        rs.kanban.storeStatusColumnModes($scope.projectId, $scope.folds);
        updateTableWidth();
      };
      return updateTableWidth = function() {
        var columnWidths, totalWidth;
        columnWidths = _.map($scope.usStatusList, function(status) {
          if ($scope.folds[status.id]) {
            return 40;
          } else {
            return 310;
          }
        });
        totalWidth = _.reduce(columnWidths, function(total, width) {
          return total + width;
        });
        return $el.find('.kanban-table-inner').css("width", totalWidth);
      };
    };
    return {
      link: link
    };
  };

  module.directive("tgKanbanSquishColumn", ["$tgResources", KanbanSquishColumnDirective]);

  KanbanWipLimitDirective = function() {
    var link;
    link = function($scope, $el, $attrs) {
      var redrawWipLimit;
      $el.disableSelection();
      redrawWipLimit = function() {
        $el.find(".kanban-wip-limit").remove();
        return timeout(200, function() {
          var element;
          element = $el.find(".kanban-task")[$scope.$eval($attrs.tgKanbanWipLimit)];
          if (element) {
            return angular.element(element).before("<div class='kanban-wip-limit'></div>");
          }
        });
      };
      $scope.$on("redraw:wip", redrawWipLimit);
      $scope.$on("kanban:us:move", redrawWipLimit);
      $scope.$on("usform:new:success", redrawWipLimit);
      $scope.$on("usform:bulk:success", redrawWipLimit);
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link
    };
  };

  module.directive("tgKanbanWipLimit", KanbanWipLimitDirective);

  KanbanUserDirective = function($log) {
    var clickable, link, template;
    template = _.template("<figure class=\"avatar\">\n    <a href=\"#\" title=\"Assign User Story\" <% if (!clickable) {%>class=\"not-clickable\"<% } %>>\n        <img src=\"<%- imgurl %>\" alt=\"<%- name %>\" class=\"avatar\">\n    </a>\n</figure>");
    clickable = false;
    link = function($scope, $el, $attrs, $model) {
      var render, wtid;
      if (!$attrs.tgKanbanUserAvatar) {
        return $log.error("KanbanUserDirective: no attr is defined");
      }
      wtid = $scope.$watch($attrs.tgKanbanUserAvatar, function(v) {
        var user;
        if ($scope.usersById == null) {
          $log.error("KanbanUserDirective requires userById set in scope.");
          return wtid();
        } else {
          user = $scope.usersById[v];
          return render(user);
        }
      });
      render = function(user) {
        var ctx, html, username_label;
        if (user === void 0) {
          ctx = {
            name: "Unassigned",
            imgurl: "/images/unnamed.png",
            clickable: clickable
          };
        } else {
          ctx = {
            name: user.full_name_display,
            imgurl: user.photo,
            clickable: clickable
          };
        }
        html = template(ctx);
        $el.html(html);
        username_label = $el.parent().find("a.task-assigned");
        username_label.html(ctx.name);
        return username_label.on("click", function(event) {
          var $ctrl, us;
          if ($el.find("a").hasClass("noclick")) {
            return;
          }
          us = $model.$modelValue;
          $ctrl = $el.controller();
          return $ctrl.changeUsAssignedTo(us);
        });
      };
      bindOnce($scope, "project", function(project) {
        if (project.my_permissions.indexOf("modify_us") > -1) {
          clickable = true;
          return $el.on("click", (function(_this) {
            return function(event) {
              var $ctrl, us;
              if ($el.find("a").hasClass("noclick")) {
                return;
              }
              us = $model.$modelValue;
              $ctrl = $el.controller();
              return $ctrl.changeUsAssignedTo(us);
            };
          })(this));
        }
      });
      return $scope.$on("$destroy", function() {
        return $el.off();
      });
    };
    return {
      link: link,
      require: "ngModel"
    };
  };

  module.directive("tgKanbanUserAvatar", ["$log", KanbanUserDirective]);

}).call(this);
