enyo.kind({
	name: "Williams_perc",
	published: {
		label: "Williams %R"
	},
	events: {
		onToggleChanged: "",
	},
	config:{
		function: "PERC_R",
		series:[{
			name: "Williams %R", 
			chart_type: "line", 
			output_index: 1
		}],
		yAxis:{}
	},
	components:[
		{name: "toggle", kind: "onyx.ToggleButton", onChange: "toggleChangedHandler", classes: "labeled-item-icon"},
		{name: "label"}
	],
	rendered: function(){
		this.inherited(arguments); 
		this.$.label.setContent(this.label);
	},
	toggleChangedHandler: function(inSender) { 
		this.doToggleChanged({enabled: inSender.value, config: this.config});
	}
});