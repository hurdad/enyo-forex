enyo.kind({
    name: "App",
    components: [
        {kind: "Panels", name:"mainPanels", classes:"app-panels enyo-fit", arrangerKind: "CollapsingArranger", components: [
            {kind: "LeftNav", name:"navPanels", onPairChange:"onPairChange"},
            {kind: "FittableRows", components: [
                {kind: "Scroller", classes:"onyx-toolbar", touchOverscroll:false, touch:true, vertical:"hidden", style:"margin:0px;", thumb:false, components: [
                    {classes: "onyx-toolbar-inline", style: "white-space: nowrap;", components: [
                        {kind: "onyx.RadioGroup", onActivate:"pagesActivated", controlClasses: "onyx-tabbutton", components: [
                            {content: "Chart", panel: "myChart", active: true},
                            {content: "Indicator Summary", panel: "mySummary"}
                        ]},
                        {kind: "onyx.RadioGroup", onActivate:"timeWindowActivated", components: [
                            {content: "auto", ts_duration: "auto", active: true},
                            {content: "1m", ts_duration: "1", ts_len:"m"},
                            {content: "30m", ts_duration: "30", ts_len:"m"},
                            {content: "1h", ts_duration: "1", ts_len:"h"},
                            {content: "1d", ts_duration: "1", ts_len:"d"},
                            {content: "1w", ts_duration: "1", ts_len:"w"},
                            {content: "1M", ts_duration: "1", ts_len:"M"}
                        ]},
                        {kind: "onyx.Button", content: "Add Indicator", ontap:"addIndicatorTapped"},
                    ]},
                ]},
                {kind:"enyo.Scroller", fit: true, style: "position: relative;", components: [
                    {kind:"Chart", name: "myChart"},
                    {kind:"Summary", name: "mySummary", showing: false},
                ]},
                {kind: "onyx.Toolbar", layoutKind:"FittableColumnsLayout", noStretch: true, classes: "footer-toolbar", components: [
                    {kind: "onyx.Grabber", ontap:"toggleFullScreen"},
                    {kind: "onyx.Button", name: "myLockButton", content: "Lock", ontap:"lock"}
                ]}
               
            ]},
        ]},
        {kind: "Pullout", name: "myPullout", classes: "pullout", onIndicatorChanged: "indicatorChanged"},

    ],
    constructor: function() {
        this.inherited(arguments);
        this.pair = 'EUR/USD';
    },
    rendered: function() {
        this.inherited(arguments);
    },
    timeWindowActivated: function(inSender, inEvent) {

        if (inEvent.originator.getActive()) {
            this.ts_len = inEvent.originator.ts_len;
            this.ts_duration = inEvent.originator.ts_duration;
            this.updateChart();
        }
    },
    pagesActivated: function(inSender, inEvent) {
    
        if (inEvent.originator.getActive()) {
            var t = this.$[inEvent.originator.panel];
            this.$.myChart.hide();
            this.$.mySummary.hide();
            t.show();
            t.resized();
        }
    },
    addIndicatorTapped: function(inSender, inEvent) {
        this.$.myPullout.animateToMin();
    },
    onPairChange: function(inSender, inEvent) {
        this.pair = inEvent.pair;
        this.updateChart();
    },
    indicatorChanged: function(inSender, inEvent) { 
        this.$.myChart.showTechnicalIndicator(inEvent);
    },
    updateChart: function(){
        this.$.myChart.showPair(this.pair, this.ts_duration, this.ts_len);
    },
    lock: function(){

        if(!this.$.mainPanels.draggable){
            this.$.mainPanels.draggable = true;
            this.$.myLockButton.setContent("Lock"); 
        }else {
            this.$.mainPanels.draggable = false;
            this.$.myLockButton.setContent("Unlock"); 
        }
    }
});