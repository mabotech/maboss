# Generated by CoffeeScript 1.7.1

#
#   * Company form
#   

#
#       *get options for select
#      get_kv = (field) ->
#      
#          dataService.getkv(params).then(
#              (data) ->
#                  $log.debug(data)
#              ,
#              (result) ->
#                  $log.debug("error", data)
#          
#          )
#      
#       * initial all select field
#      init_select = ->
#          
#          select_fields = []
#          
#          for field in select_fields
#              
#              get_kv(field)
#       

#
#      set_sysdata = (data) ->
#          
#          cols = ["modifiedon","modifiedby","createdon","createdby","rowversion"]
#          
#          for col in cols
#              $scope.system[col] = data[col]
#       

#
#        {
#            languageid:1033
#            user:'idea'
#        }
#         
(->
    "use strict"
    angular.module("maboss.CompanyFormCtrl", []).controller "CompanyFormCtrl", [
        "$scope"
        "$routeParams"
        "$log"
        "$builder"
        "$validator"
        "contextService"
        "dataService"
        "translationService"
        "helpers"
        ($scope, $routeParams, $log, $builder, $validator, contextService, dataService, translationService, helpers) ->
            get_kv = undefined
            init = undefined
            init_edit = undefined
            init_select = undefined
            name_pos = undefined
            o_code_format_type = undefined
            o_company = undefined
            o_currencycode = undefined
            o_domainmanagerid = undefined
            o_objectclass = undefined
            o_texths = undefined
            obj_list = undefined
            _t = undefined
            $scope.table = "company"
            $scope.pkey = "company"
            _t = translationService.translate
            
            
            $scope.validate = () ->
                $log.debug("in validate")
            
            $scope.system =
                modifiedon: null
                modifiedby: null
                createdon: null
                createdby: null
                rowversion: null

            name_pos = {}
            o_company =
                name: "company"
                component: "sampleInput"
                label: _t("company")
                description: ""
                placeholder: _t("company_ph")
                required: true
                editable: false

            o_texths =
                name: "texths"
                component: "sampleInput"
                label: _t("texths")
                description: ""
                placeholder: _t("texths_ph")
                required: false
                editable: false

            o_currencycode =
                name: "currencycode"
                component: "select4"
                label: _t("currencycode")
                description: ""
                placeholder: _t("currencycode_ph")
                required: false
                editable: false

            o_code_format_type =
                name: "code_format_type"
                component: "select4"
                label: _t("code_format_type")
                description: ""
                placeholder: _t("code_format_type_ph")
                required: false
                editable: false

            o_domainmanagerid =
                name: "domainmanagerid"
                component: "sampleInput"
                label: _t("domainmanagerid")
                description: ""
                placeholder: _t("domainmanagerid_ph")
                required: false
                editable: false

            o_objectclass =
                name: "objectclass"
                component: "sampleInput"
                label: _t("objectclass")
                description: ""
                placeholder: _t("objectclass_ph")
                required: false
                editable: false

            obj_list = [
                o_company
                o_texths
                o_currencycode
                o_code_format_type
                o_domainmanagerid
                o_objectclass
            ]
            init_edit = ->
                id = undefined
                id = $routeParams.id
                $scope.get()    if id

            init = ->
                context = undefined
                j = undefined
                obj = undefined
                context = contextService.get()
                j = 0
                $scope.zmodel = []
                $scope.defaultValue = {}
                j = 0
                while j < obj_list.length
                    obj = obj_list[j]
                    name_pos[obj.name] = j
                    $scope.defaultValue[j] = obj.default_    if "default_" of obj
                    $builder.addFormObject "zform", obj
                    j++
                $scope.zform = $builder.forms["zform"]
                init_select()
                init_edit()
                return

            get_kv = (table, column) ->
                [
                    table
                    column
                ]

            init_select = ->
                get_kv "currency", "currencycode"
                get_kv "code_format_type", "id"
                return

            $scope.get = ->
                params = undefined
                params = {}
                dataService.get(params).then ((data) ->
                    $log.debug data
                    $scope.defaultValue[0] = "abc"
                ), (result) ->
                    $log.debug "error", result

                return

            $scope.refresh = ->
                $scope.get()

            $scope.save = ->
                context = undefined
                fields = undefined
                item = undefined
                params = undefined
                _i = undefined
                _len = undefined
                _ref = undefined
                fields = {}
                fields.rowversion = $scope.system.rowversion    if $scope.system.rowversion
                context = contextService.get()
                _ref = $scope.zmodel
                _i = 0
                _len = _ref.length

                while _i < _len
                    item = _ref[_i]
                    if item.value.length is 0
                        fields[item.name] = null
                    else
                        fields[item.name] = item.value
                    _i++
                params =
                    table: $scope.table
                    pkey: $scope.pkey
                    columns: fields
                    context: context

                $log.debug fields
                $log.debug params
                dataService.save(params).then ((data) ->
                    pos = undefined
                    $scope.system = data.returning[0]
                    pos = name_pos["company"]
                    $builder.forms["zform"][pos].readonly = true
                    $log.debug data
                ), (reason) ->
                    $log.debug "error", reason

                return

            return init()
    ]
    return
).call this
