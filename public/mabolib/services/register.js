



select4:    return $builder.registerComponent("select4", {
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