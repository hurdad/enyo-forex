enyo.kind({
    name: "App",
    kind: "Panels",
    fit: true,
    classes: "app-panels",
    arrangerKind: "CollapsingArranger",
    components: [
        {kind: "LeftNav", name:"navPanels", onPairChange:"onPairChange"},
        {kind: "FittableRows", components: [
            {kind: "Scroller", classes:"onyx-toolbar", touchOverscroll:false, touch:true, vertical:"hidden", style:"margin:0px;", thumb:false, components: [
                {classes: "onyx-toolbar-inline", style: "white-space: nowrap;", components: [
                    {kind: "onyx.RadioGroup", onActivate:"pagesActivated", controlClasses: "onyx-tabbutton", components: [
                        {content: "Chart", active: true},
                        {content: "Indicator Summary"}
                    ]},
                    {fit:true}, // Spacer
                    {kind: "onyx.RadioGroup", onActivate:"intervalActivated", components: [
                        {content: "auto", active: true},
                        {content: "1m"},
                        {content: "30m"},
                        {content: "1h"},
                        {content: "1d"},
                        {content: "1w"},
                        {content: "1M"},
                        {content: "custom"}
                    ]},
                    {kind: "onyx.Button", content: "Add Indicator", ontap:"addIndicatorTapped"},
                ]},
            ]},
            {kind:"Chart", name: "theChart", fit:true},
    
            {kind: "onyx.Toolbar", layoutKind:"FittableColumnsLayout", name:"viewSourceToolbar", noStretch: true, classes: "footer-toolbar", components: [
                {kind: "onyx.Grabber", ontap:"toggleFullScreen"},
                {kind: "onyx.Button", name:"viewSource", content: "Lock", ontap:"viewSource"}
            ]}
           
        ]},
      
    ],
    rendered: function() {
        this.inherited(arguments);
    },
    intervalActivated: function(inSender, inEvent) {

        if (inEvent.originator.getActive()) {
            this.timeslice = inEvent.originator.content;
        }
    },
    pagesActivated: function(inSender, inEvent) {
    
        if (inEvent.originator.getActive()) {
            console.log(inEvent.originator);
        }
    },
    addIndicatorTapped: function(inSender, inEvent) {
        console.log(inEvent);
    },
    onPairChange: function(inSender, inEvent) {
        this.$.theChart.showPair(inEvent.pair, this.timeslice);
    }
  
});