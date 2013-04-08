 enyo.kind({
    name: "Summary",
    kind: "FittableColumns",  
    components: [
        {kind: "onyx.Groupbox", classes: "onyx-groupbox settings", onchange: "mapTypeChange", components: [
        {kind: "onyx.GroupboxHeader", content: "Technical Indicator"},
            {components:[
                {content: "RSI(14)", kind: "Control"},
                {content: "77.5" },
            ]},
        ]},
        {kind: "onyx.Groupbox", classes: "onyx-groupbox settings", onchange: "mapTypeChange", components: [
            {kind: "onyx.GroupboxHeader", content: "Moving Avgs"},
            {components:[
                {content: "RSMA", kind: "Control"},
                {content: "77.5" },
                {content: "BUY" },
            ]},
        ]},
    ],
    rendered: function() {
        this.inherited(arguments);
    }
    
});