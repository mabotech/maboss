'use strict';
//uglifyjs centralConfig.js -b  --comments all 
 

var centralConfig = function(module){
    
    module.config(['$builderProvider',function($builder) {
    //  registerComponent
    return $builder.registerComponent("sampleInput", {
        group: "from html",
        label: "Sample",
        description: "From html template",
        placeholder: "placeholder",
        required: false,
        validationOptions: [ {
            label: "none",
            rule: "/.*/"
        }, {
            label: "number",
            rule: "[number]"
        }, {
            label: "email",
            rule: "[email]"
        }, {
            label: "url",
            rule: "[url]"
        } ],
        templateUrl: "/builder/app/components/c1/template.html",
        popoverTemplateUrl: "/builder/app/components/c1/popoverTemplate.html"
    });
}


]). config(['$builderProvider',function($builder) {
    //  registerComponent
    return $builder.registerComponent("select4", {
        group: "from html",
        label: "Select4",
        description: "From html template",
        placeholder: "placeholder",
        required: false,    
        validationOptions: [ {
            label: "none",
            rule: "/.*/"
        }, {
            label: "number",
            rule: "[number]"
        } ],
        templateUrl: "/builder/app/components/select4/template.html",
        popoverTemplateUrl: "/builder/app/components/select4/popoverTemplate.html"
    });

    }]);
    
};
 
    