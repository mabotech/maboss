###
# Copyright (C) 2014 Andrey Antukh <niwi@niwi.be>
# Copyright (C) 2014 Jesús Espino Garcia <jespinog@gmail.com>
# Copyright (C) 2014 David Barragán Merino <bameda@dbarragan.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
# File: modules/taskboard.coffee
###

taiga = @.taiga
toggleText = @.taiga.toggleText
mixOf = @.taiga.mixOf
groupBy = @.taiga.groupBy
bindOnce = @.taiga.bindOnce
scopeDefer = @.taiga.scopeDefer
timeout = @.taiga.timeout
bindMethods = @.taiga.bindMethods

module = angular.module("taigaTaskboard")


#############################################################################
## Taskboard Controller
#############################################################################

class TaskboardController extends mixOf(taiga.Controller, taiga.PageMixin)
    @.$inject = [
        "$scope",
        "$rootScope",
        "$tgRepo",
        "$tgConfirm",
        "$tgResources",
        "$routeParams",
        "$q",
        "$appTitle",
        "$tgLocation",
        "$tgNavUrls"
        "$tgEvents"
        "$tgAnalytics",
        "tgLoader"
    ]

    constructor: (@scope, @rootscope, @repo, @confirm, @rs, @params, @q, @appTitle, @location, @navUrls,
                  @events, @analytics, tgLoader) ->
        bindMethods(@)

        @scope.sectionName = "Taskboard"
        @.initializeEventHandlers()

        promise = @.loadInitialData()

        # On Success
        promise.then =>
            @appTitle.set("Taskboard - " + @scope.project.name)
            tgLoader.pageLoaded()

        # On Error
        promise.then null, @.onInitialDataError.bind(@)

    initializeEventHandlers: ->
        # TODO: Reload entire taskboard after create/edit tasks seems
        # a big overhead. It should be optimized in near future.
        @scope.$on "taskform:bulk:success", =>
            @.loadTaskboard()
            @analytics.trackEvent("task", "create", "bulk create task on taskboard", 1)

        @scope.$on "taskform:new:success", =>
            @.loadTaskboard()
            @analytics.trackEvent("task", "create", "create task on taskboard", 1)

        @scope.$on("taskform:edit:success", => @.loadTaskboard())
        @scope.$on("taskboard:task:move", @.taskMove)

        @scope.$on "assigned-to:added", (ctx, userId, task) =>
            task.assigned_to = userId
            promise = @repo.save(task)
            promise.then null, ->
                console.log "FAIL" # TODO

    initializeSubscription: ->
        routingKey = "changes.project.#{@scope.projectId}.tasks"
        @events.subscribe @scope, routingKey, (message) =>
            @.loadTaskboard()

        routingKey1 = "changes.project.#{@scope.projectId}.userstories"
        @events.subscribe @scope, routingKey1, (message) =>
            @.refreshTagsColors()
            @.loadSprintStats()
            @.loadSprint()

    loadProject: ->
        return @rs.projects.get(@scope.projectId).then (project) =>
            @scope.project = project
            # Not used at this momment
            @scope.pointsList = _.sortBy(project.points, "order")
            # @scope.roleList = _.sortBy(project.roles, "order")
            @scope.pointsById = groupBy(project.points, (e) -> e.id)
            @scope.roleById = groupBy(project.roles, (e) -> e.id)
            @scope.taskStatusList = _.sortBy(project.task_statuses, "order")
            @scope.usStatusList = _.sortBy(project.us_statuses, "order")
            @scope.usStatusById = groupBy(project.us_statuses, (e) -> e.id)

            @scope.$emit('project:loaded', project)

            return project

    loadSprintStats: ->
        return @rs.sprints.stats(@scope.projectId, @scope.sprintId).then (stats) =>
            totalPointsSum =_.reduce(_.values(stats.total_points), ((res, n) -> res + n), 0)
            completedPointsSum = _.reduce(_.values(stats.completed_points), ((res, n) -> res + n), 0)
            remainingPointsSum = totalPointsSum - completedPointsSum
            remainingTasks = stats.total_tasks - stats.completed_tasks
            @scope.stats = stats
            @scope.stats.totalPointsSum = totalPointsSum
            @scope.stats.completedPointsSum = completedPointsSum
            @scope.stats.remainingPointsSum = remainingPointsSum
            @scope.stats.remainingTasks = remainingTasks
            if stats.totalPointsSum
                @scope.stats.completedPercentage = Math.round(100 * stats.completedPointsSum / stats.totalPointsSum)
            else
                @scope.stats.completedPercentage = 0

            @scope.stats.openTasks = stats.total_tasks - stats.completed_tasks
            return stats

    refreshTagsColors: ->
        return @rs.projects.tagsColors(@scope.projectId).then (tags_colors) =>
            @scope.project.tags_colors = tags_colors

    loadSprint: ->
        return @rs.sprints.get(@scope.projectId, @scope.sprintId).then (sprint) =>
            @scope.sprint = sprint
            @scope.userstories = _.sortBy(sprint.user_stories, "sprint_order")
            return sprint

    loadTasks: ->
        return @rs.tasks.list(@scope.projectId, @scope.sprintId).then (tasks) =>
            @scope.tasks = _.sortBy(tasks, 'taskboard_order')
            @scope.usTasks = {}

            # Iterate over all userstories and
            # null userstory for unassigned tasks
            for us in _.union(@scope.userstories, [{id:null}])
                @scope.usTasks[us.id] = {}
                for status in @scope.taskStatusList
                    @scope.usTasks[us.id][status.id] = []

            for task in @scope.tasks
                if @scope.usTasks[task.user_story]? and @scope.usTasks[task.user_story][task.status]?
                    @scope.usTasks[task.user_story][task.status].push(task)

            return tasks

    loadTaskboard: ->
        return @q.all([
            @.refreshTagsColors(),
            @.loadSprintStats(),
            @.loadSprint().then(=> @.loadTasks())
        ])

    loadInitialData: ->
        params = {
            pslug: @params.pslug
            sslug: @params.sslug
        }

        promise = @repo.resolve(params).then (data) =>
            @scope.projectId = data.project
            @scope.sprintId = data.milestone
            @.initializeSubscription()
            return data

        return promise.then(=> @.loadProject())
                      .then(=> @.loadUsersAndRoles())
                      .then(=> @.loadTaskboard())

    refreshTasksOrder: (tasks) ->
            items = @.resortTasks(tasks)
            data = @.prepareBulkUpdateData(items)

            return @rs.tasks.bulkUpdateTaskTaskboardOrder(@scope.project.id, data)

    resortTasks: (tasks) ->
        items = []

        for item, index in tasks
            item["taskboard_order"] = index
            if item.isModified()
                items.push(item)

        return items

    prepareBulkUpdateData: (uses) ->
         return _.map(uses, (x) -> {"task_id": x.id, "order": x["taskboard_order"]})

    taskMove: (ctx, task, usId, statusId, order) ->
        # Remove task from old position
        r = @scope.usTasks[task.user_story][task.status].indexOf(task)
        @scope.usTasks[task.user_story][task.status].splice(r, 1)

        # Add task to new position
        tasks = @scope.usTasks[usId][statusId]
        tasks.splice(order, 0, task)

        task.user_story = usId
        task.status = statusId
        task.taskboard_order = order

        promise = @repo.save(task)

        @rootscope.$broadcast("sprint:task:moved", task)

        promise.then =>
            @.refreshTasksOrder(tasks)
            @.loadSprintStats()

        promise.then null, =>
            console.log "FAIL TASK SAVE"

    ## Template actions
    addNewTask: (type, us) ->
        switch type
            when "standard" then @rootscope.$broadcast("taskform:new", @scope.sprintId, us?.id)
            when "bulk" then @rootscope.$broadcast("taskform:bulk", @scope.sprintId, us?.id)

    editTaskAssignedTo: (task) ->
        @rootscope.$broadcast("assigned-to:add", task)

module.controller("TaskboardController", TaskboardController)


#############################################################################
## TaskboardDirective
#############################################################################

TaskboardDirective = ($rootscope) ->
    link = ($scope, $el, $attrs) ->
        $ctrl = $el.controller()

        $el.on "click", ".toggle-analytics-visibility", (event) ->
            event.preventDefault()
            target = angular.element(event.currentTarget)
            target.toggleClass('active');
            #toggleText(target, ["Hide statistics", "Show statistics"]) # TODO: i18n
            $rootscope.$broadcast("taskboard:graph:toggle-visibility")

        tableBodyDom = $el.find(".taskboard-table-body")
        tableBodyDom.on "scroll", (event) ->
            target = angular.element(event.currentTarget)
            tableHeaderDom = $el.find(".taskboard-table-header .taskboard-table-inner")
            tableHeaderDom.css("left", -1 * target.scrollLeft())

        $scope.$on "$destroy", ->
            $el.off()

    return {link: link}

module.directive("tgTaskboard", ["$rootScope", TaskboardDirective])


#############################################################################
## Taskboard Task Directive
#############################################################################

TaskboardTaskDirective = ($rootscope) ->
    link = ($scope, $el, $attrs, $model) ->
        $el.disableSelection()

        $scope.$watch "task", (task) ->
            if task.is_blocked and not $el.hasClass("blocked")
                $el.addClass("blocked")
            else if not task.is_blocked and $el.hasClass("blocked")
                $el.removeClass("blocked")

        $el.find(".icon-edit").on "click", (event) ->
            if $el.find('.icon-edit').hasClass('noclick')
                return
            $scope.$apply ->
                $rootscope.$broadcast("taskform:edit", $scope.task)

    return {link:link}


module.directive("tgTaskboardTask", ["$rootScope", TaskboardTaskDirective])

#############################################################################
## Taskboard Table Height Fixer Directive
#############################################################################

TaskboardTableHeightFixerDirective = ->
    mainPadding = 32 # px

    renderSize = ($el) ->
        elementOffset = $el.offset().top
        windowHeight = angular.element(window).height()
        columnHeight = windowHeight - elementOffset - mainPadding
        $el.css("height", "#{columnHeight}px")

    link = ($scope, $el, $attrs) ->
        timeout(500, -> renderSize($el))

        $scope.$on "resize", ->
            renderSize($el)

    return {link:link}


module.directive("tgTaskboardTableHeightFixer", TaskboardTableHeightFixerDirective)

#############################################################################
## Taskboard Squish Column Directive
#############################################################################

TaskboardSquishColumnDirective = (rs) ->
    avatarWidth = 40

    link = ($scope, $el, $attrs) ->
        $scope.$on "sprint:task:moved", () =>
            recalculateTaskboardWidth()

        bindOnce $scope, "usTasks", (project) ->
            $scope.statusesFolded = rs.tasks.getStatusColumnModes($scope.project.id)
            $scope.usFolded = rs.tasks.getUsRowModes($scope.project.id, $scope.sprintId)

            recalculateTaskboardWidth()

        $scope.foldStatus = (status) ->
            $scope.statusesFolded[status.id] = !!!$scope.statusesFolded[status.id]
            rs.tasks.storeStatusColumnModes($scope.projectId, $scope.statusesFolded)

            recalculateTaskboardWidth()

        $scope.foldUs = (us) ->
            if !us
                $scope.usFolded["unassigned"] = !!!$scope.usFolded["unassigned"]
            else
                $scope.usFolded[us.id] = !!!$scope.usFolded[us.id]

            rs.tasks.storeUsRowModes($scope.projectId, $scope.sprintId, $scope.usFolded)

            recalculateTaskboardWidth()

        getCeilWidth = (usId, statusId) =>
            tasks = $scope.usTasks[usId][statusId].length

            if $scope.statusesFolded[statusId]
                if tasks and $scope.usFolded[usId]
                    tasksMatrixSize = Math.round(Math.sqrt(tasks))
                    width = avatarWidth * tasksMatrixSize
                else
                    width = avatarWidth

                return width

            return 0

        setStatusColumnWidth = (statusId, width) =>
            column = $el.find(".squish-status-#{statusId}")

            if width
                column.css('max-width', width)
            else
                column.css("max-width", 'none')

        refreshTaskboardTableWidth = () =>
            columnWidths = []

            columns = $el.find(".task-colum-name")

            columnWidths = _.map columns, (column) ->
                return $(column).outerWidth(true)

            totalWidth = _.reduce columnWidths, (total, width) ->
                return total + width

            $el.find('.taskboard-table-inner').css("width", totalWidth)

        recalculateStatusColumnWidth = (statusId) =>
            statusFoldedWidth = 0

            _.forEach $scope.userstories, (us) ->
                width = getCeilWidth(us.id, statusId)

                statusFoldedWidth = width if width > statusFoldedWidth

            setStatusColumnWidth(statusId, statusFoldedWidth)

        recalculateTaskboardWidth = () =>
            _.forEach $scope.taskStatusList, (status) ->
                recalculateStatusColumnWidth(status.id)

            refreshTaskboardTableWidth()

            return

    return {link: link}

module.directive("tgTaskboardSquishColumn", ["$tgResources", TaskboardSquishColumnDirective])

#############################################################################
## Taskboard User Directive
#############################################################################

TaskboardUserDirective = ($log) ->
    template = """
    <figure class="avatar avatar-assigned-to">
       <a href="#" title="Assign task" ng-class="{'not-clickable': !clickable}">
            <img ng-src="{{imgurl}}">
        </a>
    </figure>

    <figure class="avatar avatar-task-link">
       <a tg-nav="project-tasks-detail:project=project.slug,ref=task.ref" ng-attr-title="{{task.subject}}">
            <img ng-src="{{imgurl}}">
        </a>
    </figure>
    """ # TODO: i18n

    clickable = false

    link = ($scope, $el, $attrs) ->
        username_label = $el.parent().find("a.task-assigned")
        username_label.on "click", (event) ->
            if $el.find('a').hasClass('noclick')
                return

            $ctrl = $el.controller()
            $ctrl.editTaskAssignedTo($scope.task)

        $scope.$watch 'task.assigned_to', (assigned_to) ->
            user = $scope.usersById[assigned_to]

            if user is undefined
                _.assign($scope, {name: "Unassigned", imgurl: "/images/unnamed.png", clickable: clickable})
            else
                _.assign($scope, {name: user.full_name_display, imgurl: user.photo, clickable: clickable})

            username_label.text($scope.name)


        bindOnce $scope, "project", (project) ->
            if project.my_permissions.indexOf("modify_task") > -1
                clickable = true
                $el.find(".avatar-assigned-to").on "click", (event) =>
                    if $el.find('a').hasClass('noclick')
                        return

                    $ctrl = $el.controller()
                    $ctrl.editTaskAssignedTo($scope.task)

    return {
        link: link,
        template: template,
        scope: {
            "usersById": "=users",
            "project": "=",
            "task": "=",
        }
    }


module.directive("tgTaskboardUserAvatar", ["$log", TaskboardUserDirective])