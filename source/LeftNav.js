
 enyo.kind({
 	name: "LeftNav",
 	kind: "FittableRows", 
    published:{
        doo_forex_url: "http://localhost/doo-forex"
    },
 	events: {
    	onPairChange:""
	},
 	components: [
        {kind: "onyx.Toolbar", style:"background-color:#555;", layoutKind:"FittableColumnsLayout", components:[
            {content: "Enyo-Forex"},
            {fit:true}, // Spacer
            {kind: "onyx.PickerDecorator", onSelect: "refreshHandler", components: [
                {kind: "onyx.PickerButton", content: "Refresh", style: "width: 90px"},
                {kind: "onyx.Picker", components: [
                   {content: "500 ms", value: 500},
                    {content: "1 s", value: 1000},
                    {content: "5 s", value: 5000},
                    {content: "10 s", value: 10000},
                ]},

            ]},
        ]},
        {name: "list", kind: "List", classes:"list", fit: true, onSetupItem: "setupItem", components: [
            {name: "item", ontap: "itemTap", classes: "item enyo-border-box", components: [
                {name: "pair", tag: "span"},
                {tag: "span", style: "float: right; color: black;" ,components:[
                    {name: "bid", tag: "span"},
                    {content: " / ",  tag: "span"},
                    {name: "offer", tag: "span"},
                ]},
                {tag: "br"},
                {name: "date", tag: "span", style: "color: black;"},
            ]}
        ]},
    ],
    create: function() {
		this.inherited(arguments);
	},
	rendered: function() {
    	this.inherited(arguments);
       
       	//start refreshing default 500ms
      	this.refreshIntervalID = setInterval(enyo.bind(this, "refreshQuotes"), 1000);
    },
    setupItem: function(inSender, inEvent) {

    	//init vars
    	var i = inEvent.index;
        var item = this.results[i];

        //set content
        this.$.pair.setContent(item.pair);
        this.$.bid.setContent(item.bid);
        this.$.offer.setContent(item.offer);
        this.$.date.setContent(item.ts);

        //set color based on price change
        if(this.results_old !== undefined){

            if(this.results_old[i].bid > item.bid)
                this.$.bid.setStyle("color: red");

            if(this.results_old[i].bid < item.bid)
                this.$.bid.setStyle("color: green");

            if(this.results_old[i].bid == item.bid)
                this.$.bid.setStyle("color: black");

            if(this.results_old[i].offer > item.offer)
                this.$.offer.setStyle("color: red");

            if(this.results_old[i].offer < item.offer)
                this.$.offer.setStyle("color: green");

            if(this.results_old[i].offer == item.offer)
            	this.$.offer.setStyle("color: black");
            
        }

        //color on select
        this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));

        //save old
        if(i == this.$.list.getCount() - 1)
            this.results_old = this.results;
    },
    refreshQuotes: function(){

    	//jsonp request
    	var request = new enyo.JsonpRequest({
            url: this.doo_forex_url + "/live",
            callbackName: "callback"
         });

        request.response(enyo.bind(this, "processQuotes"));
        request.go();
    },
    processQuotes:  function(inRequest, inResponse) {

    	//get results and save
    	if (!inResponse) return;
        	this.results = inResponse;

        //force setupItem
        this.$.list.setCount(this.results.length);
        this.$.list.refresh();
    },
    refreshHandler: function(inSender, inEvent){

		//clear
		clearInterval(this.refreshIntervalID);

		//start
		this.refreshIntervalID = setInterval(enyo.bind(this, "refreshQuotes"), inEvent.selected.value);
	},
	itemTap: function(inSender, inEvent) {
		
		//get pair
		var item = this.results[inEvent.index];
		this.doPairChange(item);
	} 

});
