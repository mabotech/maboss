"use strict"

# uglifyjs form2_mako.js -b  --comments all
# Company form
angular.module("fbpoc.CompanyFormCtrl", []).controller "CompanyFormCtrl", [
  "$scope"
  "$builder"
  "$validator"
  "dataService"
  "$log"
  ($scope, $builder, $validator, dataService, $log) ->
  
    table = "company"
    
    name_map = {}
    

    # company.company
    o_company =
      name: "company"
      component: "sampleInput"
      label: "company"
      description: ""
      placeholder: "company"
      required: true
      editable: false
      #readonly:false,
      #default
      

    # company.texths
    o_texths =
      name: "texths"
      component: "sampleInput"
      label: "texths"
      description: ""
      placeholder: "texths"
      required: false
      editable: false
      #readonly:false,
      #default
      

    # company.currencycode
    o_currencycode =
      name: "currencycode"
      component: "select4"
      label: "currencycode"
      description: ""
      placeholder: "currencycode"
      required: false
      editable: false
      #readonly:false,
      #default
      

    # company.code_format_type
    o_code_format_type =
      name: "code_format_type"
      component: "select4"
      label: "code_format_type"
      description: ""
      placeholder: "code_format_type"
      required: false
      editable: false
      #readonly:false,
      #default
      

    # company.domainmanagerid
    o_domainmanagerid =
      name: "domainmanagerid"
      component: "sampleInput"
      label: "domainmanagerid"
      description: ""
      placeholder: "domainmanagerid"
      required: false
      editable: false
      #readonly:false,
      #default
      

    # company.objectclass
    o_objectclass =
      name: "objectclass"
      component: "sampleInput"
      label: "objectclass"
      description: ""
      placeholder: "objectclass"
      required: false
      editable: false
      #readonly:false,
      #default
      
    
    # object list / initial position
    obj_list = [
      o_company
      o_texths
      o_currencycode
      o_code_format_type
      o_domainmanagerid
      o_objectclass
    ]
    
    #
    #    init all select
    #
    init_select = ->

    
    #
    #        init
    #
    init = ->
      j = 0
      $scope.zmodel = []
      $scope.defaultValue = {}
      
      # add form objects
      j = 0
      while j < obj_list.length
        obj = obj_list[j]
        name_map[j] = obj.name
        $scope.defaultValue[j] = obj.default_  if "default_" of obj
        $builder.addFormObject "zform", obj
        j++
        
      $scope.zform = $builder.forms["zform"]
      
      #init init_select
      init_select()
      return

    
    #console.log(name_map);
    #var  track = $builder.addFormObject('form_name', tdict);
    # var  facility_code = $builder.addFormObject('form_name', fdict);
    #$scope.form = $builder.forms["zform"];
    # reset field options
    #$builder.forms["zform"][1].options = [ "", 1, 2, 3, 4 ];
    #
    #    default value
    #
    
    #$scope.defaultValue[1] = 3;
    #
    #    submit, save, refresh...
    #
    $scope.submit = ->
        #$validator.validate($scope, "zform").success(->
        #zmodel
        
        fields = {}
        
        if $scope.system.rowversion:
            # for update
            fields.rowversion = $scope.system.rowversion
        
        context = {
            languageid:1033
            user:'idea'
        }
        
        for item in $scope.zmodel
            if item.value.length == 0
                fields[item.name] = null
            else
                fields[item.name] = item.value
        
        params = 
            table:'company'
            pkey:'company'
            columns:fields
            #hardcode
            context: context


        $log.debug(fields)        
        $log.debug(params)
        
        #call service
        dataService.save(params).then(
            (data)->
                
                $scope.system = data.returning[0]
                
                $log.debug(data)
            ,
            (reason) ->
                $log.debug("error", reason)
        
        )
        

        
        #).error ->
        #show message

    
    #
    #    initialize controller
    #
    init()
]
